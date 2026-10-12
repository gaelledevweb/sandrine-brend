import express from 'express';
import { login, register, getMe } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST Inscription
router.post('/register', register);

// POST Connexion
router.post('/login', login);

// GET Profil (Protégé)
router.get('/me', verifyToken, getMe);

export default router;