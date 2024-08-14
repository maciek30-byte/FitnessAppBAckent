import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { addBurnedCalories } from '../controllers/burnedCaloriesController';
import { auth } from '../middlewares/userMiddleware';

const appRouter = express.Router();

appRouter.post('/register', registerUser);
appRouter.post('/login', loginUser);
appRouter.post('/burned-calories', auth, addBurnedCalories);

export default appRouter;
