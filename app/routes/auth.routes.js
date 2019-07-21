import express from 'express';
import { authenticateUser } from '../controllers/user.controller';
import awaitErrorHandler from '../utils/awaitErrorHandler'

const router = express.Router();

router.post('', awaitErrorHandler(authenticateUser));

export default router;
