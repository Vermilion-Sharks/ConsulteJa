import PcjController from '@controllers/pcj';
import { ApiKeyValidation } from '@middlewares/ApiKeyValidation';
import express, { type RequestHandler } from 'express';

const router = express.Router();

router.get('/pcj/:cjApiId', ApiKeyValidation, PcjController.getInfo as RequestHandler);
router.get('/pcj/:cjApiId/produtos', ApiKeyValidation, PcjController.getProducts as RequestHandler);


export default router;