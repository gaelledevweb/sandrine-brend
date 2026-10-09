import express from 'express';
import { getAllPaintings, createPainting, deletePainting } from '../controllers/paintingsController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Route publique
router.get('/', getAllPaintings);

// Routes protégées (Admin uniquement)
router.post('/', verifyToken, upload.single('image'), createPainting);
router.delete('/:id', verifyToken, deletePainting);

export default router;