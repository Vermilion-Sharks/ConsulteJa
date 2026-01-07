import UserController from '@controllers/user';
import express, { type RequestHandler } from 'express';

const router = express.Router();

router.post('/user', UserController.create as RequestHandler);

export default router;