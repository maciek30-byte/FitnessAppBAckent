import express from 'express';
import { createMicrocycle, getCurrentDayWorkout, updateWorkoutProgress, getPersonalRecords } from '../controllers/microcycleController';
import {auth} from "./auth";

const router = express.Router();

router.post('/', auth, createMicrocycle);
router.get('/current-workout', auth, getCurrentDayWorkout);
router.put('/update-progress', auth, updateWorkoutProgress);
router.get('/personal-records', auth, getPersonalRecords);

export default router;