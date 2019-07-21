import express from 'express';
import { deleteUser, updateUser } from '../controllers/user.controller';
import awaitErrorHandler from '../utils/awaitErrorHandler'

const router = express.Router();

router.delete('/', awaitErrorHandler(deleteUser));
router.put('/', awaitErrorHandler(updateUser));

export default router;