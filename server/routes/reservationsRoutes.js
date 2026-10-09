import express from 'express';
import { createReservation, getAllReservations } from '../controllers/reservationsController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
// Route publique
router.post('/', createReservation);
// Route protégée (Admin)
router.get('/', verifyToken, getAllReservations);

export default router;