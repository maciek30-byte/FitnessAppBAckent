import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    goalMet: { type: Boolean, default: false }
});

const DayPlanSchema = new mongoose.Schema({
    type: { type: String, enum: ['workout', 'rest'], required: true },
    exercises: {
        type: [ExerciseSchema],
        required: function() { return this.type === 'workout'; },
        validate: [
            {
                validator: function(exercises: any[]) {
                    return this.type !== 'workout' || (exercises && exercises.length > 0);
                },
                message: 'Exercises are required for workout days'
            }
        ]
    }
});

const MicrocycleSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    dayPlans: {
        type: Map,
        of: DayPlanSchema,
        required: true,
        validate: [
            {
                validator: function(dayPlans: Map<string, any>) {
                    return dayPlans.size === 7;
                },
                message: 'Microcycle must have plans for all 7 days of the week'
            }
        ]
    },
    weekCount: { type: Number, required: true, default: 1 }
}, { timestamps: true });

export default mongoose.model('Microcycle', MicrocycleSchema);