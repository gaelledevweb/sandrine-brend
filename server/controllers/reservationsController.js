import pool from '../config/db.js';

export const createReservation = async (req, res) => {
  const { painting_id, client_name, client_email, client_phone, message } = req.body;

  if (!painting_id || !client_name || !client_email) {
    return res.status(400).json({
      success: false,
      message: 'Les champs tableau, nom et email sont obligatoires.'
    });
  }

  try {
    // Vérifier si le tableau existe et est disponible
    const [paintings] = await pool.query('SELECT * FROM paintings WHERE id = ?', [painting_id]);

    if (paintings.length === 0) {
      return res.status(404).json({ success: false, message: 'Tableau non trouvé.' });
    }

    if (paintings[0].status !== 'AVAILABLE') {
      return res.status(400).json({ success: false, message: 'Ce tableau n\'est plus disponible à la réservation.' });
    }

    // Insérer la réservation
    const query = `
      INSERT INTO reservations (painting_id, client_name, client_email, client_phone, message)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      painting_id,
      client_name,
      client_email,
      client_phone || null,
      message || null
    ]);

    res.status(201).json({
      success: true,
      message: 'Votre demande de réservation a bien été enregistrée.',
      reservationId: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de la réservation :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la réservation.' });
  }
};

// Admin
export const getAllReservations = async (req, res) => {
  try {
    const query = `
      SELECT r.*, p.title AS painting_title, p.price AS painting_price, p.image_url
      FROM reservations r
      JOIN paintings p ON r.painting_id = p.id
      ORDER BY r.created_at DESC
    `;
    const [rows] = await pool.query(query);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};