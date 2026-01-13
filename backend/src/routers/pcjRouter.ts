import PcjController from '@controllers/pcjController';
import { ApiKeyValidation } from '@middlewares/ApiKeyValidation';
import express, { type RequestHandler } from 'express';

const router = express.Router();

router.get('/pcj/:cjApiId', ApiKeyValidation, PcjController.getInfo as RequestHandler);
router.get('/pcj/:cjApiId/produtos', ApiKeyValidation, PcjController.getProducts as RequestHandler);
router.get('/pcj/:cjApiId/produtos/marca/:marca', ApiKeyValidation, PcjController.getProductsByMarca as RequestHandler);

router.get('/pcj/:cjApiId/produtos/codigo/:codigo', ApiKeyValidation, PcjController)

export default router;