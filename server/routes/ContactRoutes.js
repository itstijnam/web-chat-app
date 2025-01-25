import express from 'express';
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getAllContacts, getContactsForDMList, SearchContacts } from '../controllers/ContactsControllers.js';


const contactsRoutes = express.Router();

contactsRoutes.post('/search', verifyToken, SearchContacts);
contactsRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDMList);
contactsRoutes.get("/get-all-contacts", verifyToken, getAllContacts);

export default contactsRoutes