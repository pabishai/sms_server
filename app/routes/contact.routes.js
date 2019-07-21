import express from 'express';
import { editContact, findContacts, createContact, deleteContact } from '../controllers/contacts.controller';
import awaitErrorHandler from '../utils/awaitErrorHandler'


const router = express.Router();


router.get('/:number', awaitErrorHandler(findContacts));
router.put('/:number', awaitErrorHandler(editContact));
router.post('', awaitErrorHandler(createContact));
router.delete('/:id', awaitErrorHandler(deleteContact));

export default router;