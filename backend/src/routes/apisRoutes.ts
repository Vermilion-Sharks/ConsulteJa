import ApisController from '@controllers/apisController';
import { VSAuth } from '@middlewares/auth';
import express, { RequestHandler } from 'express';

const router = express.Router();

router.post('/ac', VSAuth, ApisController.criar as RequestHandler);
router.get('/ac', VSAuth, ApisController.listar as RequestHandler);
router.post('/ac/:api_id/key', VSAuth, ApisController.gerarKey as RequestHandler);
router.post('/ac/:api_id/produto', VSAuth)

export default router;