import express from 'express';
import { login, getMe } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST login
router.post('/login', login);

// GET (Protégé)
router.get('/me', verifyToken, getMe);

export default router;