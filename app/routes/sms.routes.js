import express from 'express';
import { createSms, updateSms, deleteSms, findSms } from '../controllers/sms.controller';
import awaitErrorHandler from '../utils/awaitErrorHandler'


const router = express.Router();


router.post('/', awaitErrorHandler(createSms));
router.put('/:id', awaitErrorHandler(updateSms));
router.get('/:id', awaitErrorHandler(findSms));
router.delete('/:id', awaitErrorHandler(deleteSms));


export default router;