import express from 'express';
import { 
  createReservation, 
  getAllReservations, 
  getUserReservations,
  validateReservation,
  deleteReservation 
} from '../controllers/reservationsController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route publique (Créer une réservation)
router.post('/', createReservation);

// Route protégée utilisateur (Voir ses propres réservations)
router.get('/my-reservations', verifyToken, getUserReservations);

// Route protégée admin (Voir toutes les réservations)
router.get('/', verifyToken, getAllReservations);

// Route protégée admin (Valider une réservation)
router.put('/:id/validate', verifyToken, validateReservation);

// Route protégée admin (Supprimer une réservation)
router.delete('/:id', verifyToken, deleteReservation);

export default router;