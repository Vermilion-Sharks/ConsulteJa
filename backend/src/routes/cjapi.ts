import CjapiController from '@controllers/cjapi';
import { VSAuth } from '@middlewares/VSAuth';
import express, {type RequestHandler} from 'express';

const router = express.Router();

router.post('/cjapi', VSAuth, CjapiController.create as RequestHandler);
router.get('/cjapi', VSAuth, CjapiController.list as RequestHandler);
router.post('/cjapi/:cjapiId/apikey', VSAuth);

export default router;