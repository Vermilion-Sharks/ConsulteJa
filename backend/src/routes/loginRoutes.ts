import express, { RequestHandler } from 'express';
import RateLimit from '@middlewares/rateLimit';
import LoginController from '@controllers/loginController';
import { authenticateToken } from '@middlewares/auth';

const router = express.Router();

router.post('/login', RateLimit.limiteLogin, LoginController.logar as RequestHandler);
router.post('/logout', LoginController.deslogar as RequestHandler);
router.get('/teste', authenticateToken, (req,res)=>res.send('opa'))

export default router;