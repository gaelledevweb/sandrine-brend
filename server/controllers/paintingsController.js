import pool from '../config/db.js';
import { cloudinary } from '../config/cloudinary.js';

// GET public
export const getAllPaintings = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM paintings ORDER BY id DESC');
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des tableaux :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des tableaux.'
    });
  }
};

// POST admin
export const createPainting = async (req, res) => {
  const { title, dimensions, technique, price, status } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Veuillez fournir une image.' });
  }

  try {
    const imageUrl = req.file.path;
    const publicId = req.file.filename;

    const query = `
      INSERT INTO paintings (title, dimensions, technique, price, status, image_url, cloudinary_public_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
      title,
      dimensions,
      technique,
      price,
      status || 'AVAILABLE',
      imageUrl,
      publicId
    ]);

    res.status(201).json({
      success: true,
      message: 'Tableau ajouté avec succès.',
      paintingId: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de la création du tableau :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la création du tableau.' });
  }
};

// DELETE admin
export const deletePainting = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM paintings WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tableau non trouvé.' });
    }

    const painting = rows[0];

    // Supprimer l'image sur Cloudinary si elle y est hébergée
    if (painting.cloudinary_public_id) {
      await cloudinary.uploader.destroy(painting.cloudinary_public_id);
    }

    await pool.query('DELETE FROM paintings WHERE id = ?', [id]);

    res.status(200).json({ success: true, message: 'Tableau supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du tableau :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la suppression.' });
  }
};