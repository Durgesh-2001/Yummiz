import express from 'express';
import { loginUser, registerUser, sendOTP, verifyOTP, otpLimiter, countUsers } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/send-otp', otpLimiter, sendOTP); // Added rate limiter
userRouter.post('/verify-otp', verifyOTP);
userRouter.get('/count', countUsers);

export default userRouter;
