import express from 'express';

// * Importing routes
import userRoutes from './user';
import authRoutes from './auth';

const router = express.Router();

router.use('/api', userRoutes);
router.use('/api', authRoutes);

export default router;