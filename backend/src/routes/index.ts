import express from 'express';
import usuarioRoutes from './usuarioRoutes';
import loginRoutes from './loginRoutes';

const router = express.Router();

router.use('/api', usuarioRoutes);
router.use('/api', loginRoutes);

export default router;