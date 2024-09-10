import express from 'express';
import { getUserProgress, updateUserProgress } from '../controllers/userController';
import { auth } from '../middlewares/userMiddleware';

const router = express.Router();

router.get('/progress', auth, getUserProgress);
router.put('/progress', auth, updateUserProgress);

export default router;