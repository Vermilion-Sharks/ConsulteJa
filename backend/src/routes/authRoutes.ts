import express, { RequestHandler } from 'express';
import RateLimit from '@middlewares/rateLimit';
import AuthController from '@controllers/authController';
import { VSAuth } from '@middlewares/auth';

const router = express.Router();

router.post('/auth/login', RateLimit.limiteLogin, AuthController.logar as RequestHandler);
router.post('/auth/logout', VSAuth, AuthController.deslogar as RequestHandler);
// * Configurar novas rotas
router.get('/auth/sessions', VSAuth, AuthController.listar as RequestHandler);
router.delete('/auth/sessions', VSAuth, AuthController.deslogarGlobal as RequestHandler);
// router.delete('/auth/sessions/:session_id')

export default router;