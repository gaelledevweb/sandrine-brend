import express from 'express';
import { sendMessage, getAllMessages } from '../controllers/contactController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
// Route publique
router.post('/', sendMessage);
// Route protégée (Admin)
router.get('/', verifyToken, getAllMessages);

export default router;