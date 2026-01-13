import PcjController from '@controllers/pcjController';
import { ApiKeyValidation } from '@middlewares/ApiKeyValidation';
import express, { type RequestHandler } from 'express';

const router = express.Router();

router.get('/pcj/:cjapiId', ApiKeyValidation, PcjController.getInfo as RequestHandler);
router.get('/pcj/:cjapiId/produtos', ApiKeyValidation, PcjController.getProducts as RequestHandler);
router.get('/pcj/:cjapiId/produtos/marca/:marca', ApiKeyValidation, PcjController.getProductsByMarca as RequestHandler);
router.get('/pcj/:cjapiId/produtos/nome/:nome', ApiKeyValidation, PcjController.getProductsByNome as RequestHandler);
router.get('/pcj/:cjapiId/produtos/descricao/:descricao', ApiKeyValidation, PcjController.getProductsByDescricao as RequestHandler);
router.get('/pcj/:cjapiId/produtos/codigo/:codigo', ApiKeyValidation, PcjController.getProductByCodigo as RequestHandler);
router.get('/pcj/:cjapiId/produtos/id/:productId', ApiKeyValidation, PcjController.getProductById as RequestHandler);

export default router;