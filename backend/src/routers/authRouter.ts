import express, { type RequestHandler } from 'express';
import RateLimit from '@middlewares/rateLimit';
import AuthController from '@controllers/authController';
import { VSAuth  } from '@middlewares/VSAuth';

const router = express.Router();

router.post('/auth/login', RateLimit.login, AuthController.login as RequestHandler);
router.post('/auth/logout', VSAuth, AuthController.logout as RequestHandler);
router.get('/auth/sessions', VSAuth, AuthController.list as RequestHandler);
router.delete('/auth/sessions', VSAuth, AuthController.globalLogout as RequestHandler);
router.delete('/auth/sessions/:sessionId', VSAuth, AuthController.remoteLogout as RequestHandler);
router.post('/auth/google', RateLimit.login, AuthController.googleLogin as RequestHandler);

export default router;