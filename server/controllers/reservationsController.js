import pool from '../config/db.js';

// Créer une réservation
export const createReservation = async (req, res) => {
  const { painting_id, client_name, client_email, client_phone, message } = req.body;

  if (!painting_id || !client_name || !client_email) {
    return res.status(400).json({
      success: false,
      message: 'Les champs tableau, nom et email sont obligatoires.'
    });
  }

  try {
    const [paintings] = await pool.query('SELECT * FROM paintings WHERE id = ?', [painting_id]);

    if (paintings.length === 0) {
      return res.status(404).json({ success: false, message: 'Tableau non trouvé.' });
    }

    if (paintings[0].status !== 'AVAILABLE') {
      return res.status(400).json({ success: false, message: 'Ce tableau n\'est plus disponible à la réservation.' });
    }

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

    await pool.query(
      `UPDATE paintings SET status = 'RESERVED' WHERE id = ?`,
      [painting_id]
    );

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

// Admin : Récupérer toutes les réservations
export const getAllReservations = async (req, res) => {
  try {
    const query = `
      SELECT r.*, 
             COALESCE(r.status, 'PENDING') AS status,
             p.title AS painting_title, 
             p.price AS painting_price, 
             p.price AS price, 
             p.image_url, 
             p.dimensions, 
             p.technique
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

// Utilisateur : Récupérer uniquement ses propres réservations (basé sur l'email de son compte en BDD)
export const getUserReservations = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    let userEmail = '';
    if (userRole === 'admin') {
      const [admins] = await pool.query('SELECT email FROM admins WHERE id = ?', [userId]);
      if (admins.length > 0) userEmail = admins[0].email;
    } else {
      const [users] = await pool.query('SELECT email FROM users WHERE id = ?', [userId]);
      if (users.length > 0) userEmail = users[0].email;
    }

    if (!userEmail) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const query = `
      SELECT r.*, 
             COALESCE(r.status, 'PENDING') AS status,
             p.title AS painting_title, 
             p.price AS painting_price, 
             p.price AS price, 
             p.image_url, 
             p.dimensions, 
             p.technique
      FROM reservations r
      JOIN paintings p ON r.painting_id = p.id
      WHERE LOWER(r.client_email) = LOWER(?)
      ORDER BY r.created_at DESC
    `;
    const [rows] = await pool.query(query, [userEmail]);

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Erreur récupération mes réservations :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// Admin : Valider une réservation et marquer le tableau comme vendu (SOLD)
export const validateReservation = async (req, res) => {
  const { id } = req.params;
  try {
    // Récupérer le painting_id associé à cette réservation
    const [reservationRows] = await pool.query('SELECT painting_id FROM reservations WHERE id = ?', [id]);
    
    if (reservationRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Réservation introuvable.' });
    }

    const paintingId = reservationRows[0].painting_id;

    // Mettre à jour le statut de la réservation à 'VALIDATED'
    await pool.query('UPDATE reservations SET status = ? WHERE id = ?', ['VALIDATED', id]);

    // Mettre à jour le statut du tableau à 'SOLD' pour qu'il apparaisse comme vendu dans la galerie
    await pool.query("UPDATE paintings SET status = 'SOLD' WHERE id = ?", [paintingId]);

    res.status(200).json({ success: true, message: 'Réservation validée et tableau marqué comme vendu.' });
  } catch (error) {
    console.error('Erreur validation réservation :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// Supprimer une réservation et remettre le tableau en AVAILABLE pour l'admin
export const deleteReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const [reservation] = await pool.query('SELECT painting_id FROM reservations WHERE id = ?', [id]);
    
    if (reservation.length > 0) {
      const paintingId = reservation[0].painting_id;
      await pool.query('UPDATE paintings SET status = ? WHERE id = ?', ['AVAILABLE', paintingId]);
    }

    await pool.query('DELETE FROM reservations WHERE id = ?', [id]);

    res.status(200).json({ success: true, message: 'Réservation supprimée et tableau libéré avec succès.' });
  } catch (error) {
    console.error('Erreur suppression réservation :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};