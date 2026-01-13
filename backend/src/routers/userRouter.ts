import UserController from '@controllers/userController';
import express, { type RequestHandler } from 'express';

const router = express.Router();

router.post('/user', UserController.create as RequestHandler);

export default router;