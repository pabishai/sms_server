import express from 'express';
import { createSms, updateSms, deleteSms, findSms, sendSMS, readSMS, unreadSMS } from '../controllers/sms.controller';
import awaitErrorHandler from '../utils/awaitErrorHandler'


const router = express.Router();

router.post('/', awaitErrorHandler(createSms));
router.put('/:id', awaitErrorHandler(updateSms));
router.get('/:id', awaitErrorHandler(findSms));
router.delete('/:id', awaitErrorHandler(deleteSms));
router.put('/:id/read', awaitErrorHandler(readSMS));
router.put('/:id/send', awaitErrorHandler(sendSMS));
router.put('', awaitErrorHandler(unreadSMS));

export default router;