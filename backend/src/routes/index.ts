import express from 'express';
import usuarioRoutes from './usuarioRoutes';
import authRoutes from './authRoutes';

const router = express.Router();

router.use('/api', usuarioRoutes);
router.use('/api', authRoutes);

export default router;