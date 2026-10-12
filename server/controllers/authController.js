import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Inscription d'un nouvel utilisateur (visiteur)
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Veuillez remplir tous les champs' });
    }

    const [existingUsers] = await pool.query('SELECT email FROM users WHERE email = ?', [email]);
    const [existingAdmins] = await pool.query('SELECT email FROM admins WHERE email = ?', [email]);

    if (existingUsers.length > 0 || existingAdmins.length > 0) {
      return res.status(400).json({ success: false, message: 'Un compte existe déjà avec cet e-mail' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'user']
    );

    const userId = result.insertId;
    const token = jwt.sign(
      { id: userId, role: 'user' },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        name,
        email,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la création du compte' });
  }
};

// Connexion unique (Artiste ou visiteur)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Veuillez fournir un e-mail et un mot de passe' });
    }

    // Vérifier dans admins
    const [admins] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (admins.length > 0) {
      const admin = admins[0];
      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        const token = jwt.sign(
          { id: admin.id, role: 'admin' },
          process.env.JWT_SECRET || 'secret_key',
          { expiresIn: '7d' }
        );
        return res.json({
          success: true,
          token,
          user: {
            id: admin.id,
            name: admin.username,
            email: admin.email,
            role: 'admin'
          }
        });
      }
    }

    // Vérifier dans users
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length > 0) {
      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign(
          { id: user.id, role: user.role || 'user' },
          process.env.JWT_SECRET || 'secret_key',
          { expiresIn: '7d' }
        );
        return res.json({
          success: true,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || 'user'
          }
        });
      }
    }

    return res.status(400).json({ success: false, message: 'Identifiants incorrects' });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la connexion' });
  }
};

// Profil utilisateur
export const getMe = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const [admins] = await pool.query('SELECT id, username as name, email FROM admins WHERE id = ?', [req.user.id]);
      if (admins.length === 0) return res.status(404).json({ success: false, message: 'Admin introuvable' });
      return res.json({ success: true, user: { ...admins[0], role: 'admin' } });
    }

    const [users] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    res.json({ success: true, user: users[0] });
  } catch (error) {
    console.error('Erreur getMe:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};