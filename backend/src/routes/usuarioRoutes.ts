import UsuarioController from '@controllers/usuarioController';
import express, { RequestHandler } from 'express';

const router = express.Router();

router.post('/usuario', UsuarioController.cadastrar as RequestHandler);

export default router;