import { Request, Response } from 'express';
import Microcycle from '../models/MicroCycle';
import mongoose from 'mongoose';

export const createMicrocycle = async (req: Request, res: Response) => {
    try {
        console.log('Received data for microcycle creation:', JSON.stringify(req.body, null, 2));
        const { startDate, endDate, dayPlans, weekCount } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Ensure all days are present and have the correct structure
        const validatedDayPlans = new Map();
        for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']) {
            const plan = dayPlans[day];
            if (!plan || !plan.type) {
                return res.status(400).json({ message: `Invalid or missing plan for ${day}` });
            }
            validatedDayPlans.set(day, {
                type: plan.type,
                exercises: plan.type === 'workout' ? plan.exercises : []
            });
        }

        const newMicrocycle = new Microcycle({
            userId,
            startDate,
            endDate,
            dayPlans: validatedDayPlans,
            weekCount
        });

        await newMicrocycle.save();
        console.log('Microcycle created successfully:', newMicrocycle);

        res.status(201).json({ message: 'Microcycle created successfully', microcycle: newMicrocycle });
    } catch (error) {
        console.error('Error creating microcycle:', error);
        res.status(500).json({ message: 'Error creating microcycle', error: (error as Error).message });
    }
};

export const getCurrentDayWorkout = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const today = new Date();
        const currentMicrocycle = await Microcycle.findOne({
            userId,
            startDate: { $lte: today },
            endDate: { $gte: today }
        });

        if (!currentMicrocycle) {
            return res.status(404).json({ message: 'No active microcycle found' });
        }

        const dayOfWeek = today.toLocaleString('en-us', {weekday: 'long'});
        const todayWorkout = currentMicrocycle.dayPlans.get(dayOfWeek);

        if (!todayWorkout) {
            return res.status(404).json({ message: 'No workout found for today' });
        }

        res.status(200).json(todayWorkout);
    } catch (error) {
        console.error('Error fetching current day workout:', error);
        res.status(500).json({ message: 'Error fetching current day workout', error: (error as Error).message });
    }
};

export const updateWorkoutProgress = async (req: Request, res: Response) => {
    try {
        const { microcycleId, day, exerciseId, completed, goalMet } = req.body;
        const userId = req.user?.id;

        const microcycle = await Microcycle.findOne({ _id: microcycleId, userId });

        if (!microcycle) {
            return res.status(404).json({ message: 'Microcycle not found' });
        }

        const dayPlan = microcycle.dayPlans.get(day);
        if (!dayPlan || dayPlan.type !== 'workout') {
            return res.status(400).json({ message: 'Invalid day or not a workout day' });
        }

        const exercise = dayPlan.exercises.find(e => e._id.toString() === exerciseId);
        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }

        if (completed !== undefined) exercise.completed = completed;
        if (goalMet !== undefined) exercise.goalMet = goalMet;

        await microcycle.save();

        res.status(200).json({ message: 'Workout progress updated successfully' });
    } catch (error) {
        console.error('Error updating workout progress:', error);
        res.status(500).json({ message: 'Error updating workout progress', error: (error as Error).message });
    }
};

export const getPersonalRecords = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const records = await Microcycle.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $unwind: "$dayPlans" },
            { $unwind: "$dayPlans.exercises" },
            { $group: {
                    _id: "$dayPlans.exercises.name",
                    maxWeight: { $max: "$dayPlans.exercises.weight" }
                }},
            { $project: {
                    exercise: "$_id",
                    maxWeight: 1,
                    _id: 0
                }}
        ]);

        res.status(200).json(records);
    } catch (error) {
        console.error('Error fetching personal records:', error);
        res.status(500).json({ message: 'Error fetching personal records', error: (error as Error).message });
    }
};