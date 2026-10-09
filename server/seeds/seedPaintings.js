import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const paintings = [
  { title: "Cercle de tendresse", dimensions: "Diamètre 40 cm (Tondo)", technique: "Huile sur toile", price: 380.00, image_url: "cercle_de_tendresse.jpg", cloudinary_public_id: "cercle_de_tendresse" },
  { title: "Chuchotements floraux", dimensions: "80x60 cm", technique: "Technique mixte sur canvas", price: 520.00, image_url: "chuchotements_floraux.jpg", cloudinary_public_id: "chuchotements_floraux" },
  { title: "Danse cosmique", dimensions: "100x80 cm", technique: "Huile et pigment sur toile", price: 750.00, image_url: "danse_cosmique.jpg", cloudinary_public_id: "danse_cosmique" },
  { title: "Douceur printanière", dimensions: "70x50 cm", technique: "Aquarelle et encre sur toile", price: 450.00, image_url: "douceur_printaniere.jpg", cloudinary_public_id: "douceur_printaniere" },
  { title: "Éphéméride végétale", dimensions: "60x80 cm", technique: "Technique mixte", price: 490.00, image_url: "ephemeride_vegetale.jpg", cloudinary_public_id: "ephemeride_vegetale" },
  { title: "Floraison d'étoiles", dimensions: "120x90 cm", technique: "Huile et dorure sur toile", price: 890.00, image_url: "floraison_detoiles.jpg", cloudinary_public_id: "floraison_detoiles" },
  { title: "Floraison incandescente", dimensions: "100x70 cm", technique: "Huile sur chassis", price: 680.00, image_url: "floraison_incandescente.jpg", cloudinary_public_id: "floraison_incandescente" },
  { title: "Harmonie florale", dimensions: "80x80 cm", technique: "Technique mixte", price: 580.00, image_url: "harmonie_florale.jpg", cloudinary_public_id: "harmonie_florale" },
  { title: "L'évanescence nuptiale", dimensions: "100x100 cm", technique: "Huile et pigments naturels", price: 920.00, image_url: "levanescence_nuptiale.jpg", cloudinary_public_id: "levanescence_nuptiale" },
  { title: "L'éveil des songes délicats", dimensions: "120x40 cm (Panoramique)", technique: "Huile sur toile", price: 650.00, image_url: "leveil_des_songes_delicats.jpg", cloudinary_public_id: "leveil_des_songes_delicats" },
  { title: "L'éveil des teintes", dimensions: "80x60 cm", technique: "Huile et peinture au couteau sur toile", price: 540.00, image_url: "leveil_des_teintes.jpg", cloudinary_public_id: "leveil_des_teintes" },
  { title: "Murmure du vent dans les herbes", dimensions: "90x70 cm", technique: "Technique mixte et pastel", price: 590.00, image_url: "murmure_du_vent_dans_les_herbes.jpg", cloudinary_public_id: "murmure_du_vent_dans_les_herbes" },
  { title: "Nébula rosa", dimensions: "60x60 cm", technique: "Huile et pigments sur canvas", price: 460.00, image_url: "nebula_rosa.jpg", cloudinary_public_id: "nebula_rosa" },
  { title: "Racines de soie", dimensions: "100x70 cm", technique: "Huile et pigments naturels", price: 690.00, image_url: "racines_de_soie.jpg", cloudinary_public_id: "racines_de_soie" },
  { title: "Rêve de tulle et de pétales", dimensions: "80x65 cm", technique: "Technique mixte sur toile", price: 570.00, image_url: "reve_de_tulle_et_de_petales.jpg", cloudinary_public_id: "reve_de_tulle_et_de_petales" },
  { title: "Sous les ramures de la nuit", dimensions: "100x80 cm", technique: "Huile sur toile", price: 720.00, image_url: "sous_les_ramures_de_la_nuit.jpg", cloudinary_public_id: "sous_les_ramures_de_la_nuit" },
  { title: "Symphonie crépusculaire", dimensions: "120x50 cm (Panoramique)", technique: "Huile et encre sur chassis", price: 780.00, image_url: "symphonie_crepusculaire.jpg", cloudinary_public_id: "symphonie_crepusculaire" },
  { title: "Triptyque floral", dimensions: "120x100 cm (3 panneaux)", technique: "Technique mixte sur bois/toile", price: 1100.00, image_url: "triptyque_floral.jpg", cloudinary_public_id: "triptyque_floral" },
  { title: "Voie lactée florale", dimensions: "70x70 cm", technique: "Huile et dorures sur canvas", price: 510.00, image_url: "voie_lactee_florale.jpg", cloudinary_public_id: "voie_lactee_florale" }
];

async function seedDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  try {
    const dbName = process.env.DB_NAME || 'sandrine_brend';

    console.log(`Création de la base de données "${dbName}"...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${dbName}\`;`);

    console.log('Création des tables...');

    // Table admins
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Table paintings
    await connection.query(`
      CREATE TABLE IF NOT EXISTS paintings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        dimensions VARCHAR(100) NOT NULL,
        technique VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        status ENUM('AVAILABLE', 'RESERVED', 'SOLD') DEFAULT 'AVAILABLE',
        image_url VARCHAR(255) NOT NULL,
        cloudinary_public_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Table reservations
    await connection.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        painting_id INT NOT NULL,
        client_name VARCHAR(100) NOT NULL,
        client_email VARCHAR(100) NOT NULL,
        client_phone VARCHAR(20),
        message TEXT,
        status ENUM('PENDING', 'CONFIRMED', 'CANCELLED') DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (painting_id) REFERENCES paintings(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Table contacts
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('Réinitialisation des données de la table "paintings"...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE paintings');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    const query = `
      INSERT INTO paintings (title, dimensions, technique, price, status, image_url, cloudinary_public_id)
      VALUES ?
    `;

    const values = paintings.map(p => [
      p.title,
      p.dimensions,
      p.technique,
      p.price,
      'AVAILABLE',
      p.image_url,
      p.cloudinary_public_id
    ]);

    await connection.query(query, [values]);
    console.log('Base de données créée, tables générées et 19 tableaux insérés avec succès !');

  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la BDD :', error);
  } finally {
    await connection.end();
  }
}

seedDatabase();