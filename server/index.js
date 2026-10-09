import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import paintingsRoutes from './routes/paintingsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import reservationsRoutes from './routes/reservationsRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/paintings', paintingsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/contact', contactRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API Sandrine Brend opérationnelle' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});