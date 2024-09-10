import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other'],
  },
  level: {
    type: Number,
    default: 1,
  },
  experience: {
    type: Number,
    default: 0,
  },
  nextLevelExperience: {
    type: Number,
    default: 100,
  },
});

const User = mongoose.model('User', UserSchema);
export default User;