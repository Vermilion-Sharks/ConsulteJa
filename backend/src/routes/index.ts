import express from 'express';
import usuarioRoutes from './usuarioRoutes';
import authRoutes from './authRoutes';
import apisRoutes from './apisRoutes';

const router = express.Router();

router.use('/api', usuarioRoutes);
router.use('/api', authRoutes);
router.use('/api', apisRoutes);

export default router;