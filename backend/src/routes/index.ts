import express from 'express';

// * Importing routes
import userRoutes from './user';
import authRoutes from './auth';
import cjapiRoutes from './cjapi';
import pcjRoutes from './pcj';

const router = express.Router();

router.use('/api', userRoutes);
router.use('/api', authRoutes);
router.use('/api', cjapiRoutes);
router.use('/api', pcjRoutes);

export default router;