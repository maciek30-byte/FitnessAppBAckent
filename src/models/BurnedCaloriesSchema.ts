import mongoose from 'mongoose';

const BurnedCaloriesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const BurnedCalories = mongoose.model('BurnedCalories', BurnedCaloriesSchema);

export default BurnedCalories;
