import pool from '../config/db.js';

// Public
export const sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Les champs nom, email et message sont obligatoires.'
    });
  }

  try {
    const query = 'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)';
    await pool.query(query, [name, email, subject || 'Sans objet', message]);

    res.status(201).json({
      success: true,
      message: 'Votre message a bien été envoyé.'
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de l\'envoi du message.' });
  }
};

// Admin
export const getAllMessages = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};