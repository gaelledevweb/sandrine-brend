import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function seedAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sandrine_brend'
  });

  try {
    const username = 'admin';
    const email = 'sandrine.brend.peintures@gmail.com';
    const rawPassword = 'ArtisteBrend0903***';

    // Chiffrement du mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);

    const [existing] = await connection.query('SELECT * FROM admins WHERE email = ?', [email]);

    if (existing.length > 0) {
      console.log('L\'administrateur existe déjà dans la base.');
    } else {
      await connection.query(
        'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      console.log('Compte Administrateur créé avec succès !');
      console.log(`Identifiants -> Email: ${email} | Mot de passe: ${rawPassword}`);
    }
  } catch (error) {
    console.error('Erreur lors du seed Admin :', error);
  } finally {
    await connection.end();
  }
}

seedAdmin();