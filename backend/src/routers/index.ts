import express from 'express';

// * Importing routes
import userRoutes from './userRouter';
import authRoutes from './authRouter';
import cjapiRoutes from './cjapiRouter';
import pcjRoutes from './pcjRouter';

const router = express.Router();

router.use('/api', userRoutes);
router.use('/api', authRoutes);
router.use('/api', cjapiRoutes);
router.use('/api', pcjRoutes);

export default router;