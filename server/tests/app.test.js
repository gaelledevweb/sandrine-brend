import request from 'supertest';
import express from 'express';

const app = express();
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API Sandrine Brend opérationnelle' });
});

describe('Test de l\'API Backend', () => {
  it('Devrait retourner un statut 200 sur la route /api/health', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('Devrait retourner une erreur 404 pour une route inexistante', async () => {
    const response = await request(app).get('/api/route-inexistante');
    expect(response.statusCode).toBe(404);
  });
});