import PcjController from '@controllers/pcj';
import { ApiKeyValidation } from '@middlewares/ApiKeyValidation';
import express, { type RequestHandler } from 'express';

const router = express.Router();

router.get('/pcj/:cjApiId', ApiKeyValidation, PcjController.getInfo as RequestHandler);
router.get('/pxj/:cjApiId/produtos', ApiKeyValidation);

export default router;