import CjapiController from '@controllers/cjapi';
import { VSAuth } from '@middlewares/VSAuth';
import express, {type RequestHandler} from 'express';

const router = express.Router();

router.post('/cjapi', VSAuth, CjapiController.create as RequestHandler);
router.get('/cjapi', VSAuth, CjapiController.list as RequestHandler);
router.get('/cjapi/:cjapiId', VSAuth, CjapiController.getInfo as RequestHandler);
router.delete('/cjapi/:cjapiId', VSAuth, CjapiController.delete as RequestHandler);
router.post('/cjapi/:cjapiId/apikey', VSAuth, CjapiController.genApiKey as RequestHandler);
router.post('/cjapi/:cjapiId/status', VSAuth, CjapiController.updateStatus as RequestHandler);
router.post('/cjapi/:cjapiId/product', VSAuth, CjapiController.addProduct as RequestHandler);
router.get('/cjapi/:cjapiId/product', VSAuth, CjapiController.findProducts as RequestHandler);
router.post('/cjapi/:cjapiId/product/:productId', VSAuth, CjapiController.editProduct as RequestHandler);
router.get('/cjapi/:cjapiId/product/:productId', VSAuth, CjapiController.findSingleProduct as RequestHandler);
router.delete('/cjapi/:cjapiId/product/:productId', VSAuth, CjapiController.deleteSingleProduct as RequestHandler);

export default router;