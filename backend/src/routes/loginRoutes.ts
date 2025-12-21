import express, { RequestHandler } from 'express';
import RateLimit from '@middlewares/rateLimit';
import LoginController from '@controllers/loginController';

const router = express.Router();

router.post('/login', RateLimit.limiteGeral, LoginController.logar as RequestHandler);
router.post('/logout', LoginController.deslogar as RequestHandler);

export default router;