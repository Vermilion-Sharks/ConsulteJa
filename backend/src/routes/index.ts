import express from 'express';

// * Importing routes
import userRoutes from './user';
import authRoutes from './auth';
import cjapiRoutes from './cjapi';

const router = express.Router();

router.use('/api', userRoutes);
router.use('/api', authRoutes);
router.use('/api', cjapiRoutes)

export default router;