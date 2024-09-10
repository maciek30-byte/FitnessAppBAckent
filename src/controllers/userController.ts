import { Request, Response } from 'express';
import User from '../models/User';

export const getUserProgress = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const progressData = {
            level: user.level,
            experience: user.experience,
            nextLevelExperience: user.nextLevelExperience,
        };

        res.status(200).json(progressData);
    } catch (error) {
        console.error('Error fetching user progress:', error);
        res.status(500).json({ message: 'Error fetching user progress', error: error.message });
    }
};

export const updateUserProgress = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { experience } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.experience += experience;

        // Check if user leveled up
        while (user.experience >= user.nextLevelExperience) {
            user.level += 1;
            user.experience -= user.nextLevelExperience;
            user.nextLevelExperience = Math.floor(user.nextLevelExperience * 1.1); // Increase next level requirement by 10%
        }

        await user.save();

        const progressData = {
            level: user.level,
            experience: user.experience,
            nextLevelExperience: user.nextLevelExperience,
        };

        res.status(200).json(progressData);
    } catch (error) {
        console.error('Error updating user progress:', error);
        res.status(500).json({ message: 'Error updating user progress', error: error.message });
    }
};