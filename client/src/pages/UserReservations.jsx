import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import API from '../services/api';

const UserReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserReservations();
  }, []);

  const fetchUserReservations = async () => {
    try {
      const res = await API.get('/reservations/my-reservations');
      const items = res.data?.data || res.data?.reservations || (Array.isArray(res.data) ? res.data : []);
      setReservations(items);
    } catch (err) {
      console.error('Erreur chargement réservations :', err);
      setError('Impossible de charger vos réservations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h1 className="font-serif text-center mb-2">Mes Réservations</h1>
      <p className="text-center text-muted mb-5">
        Suivez l'état de validation de vos demandes d'acquisition
      </p>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Chargement de vos réservations...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && reservations.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">Vous n'avez effectué aucune réservation pour le moment.</p>
        </div>
      )}

      {!loading && !error && reservations.length > 0 && (
        <Row xs={1} md={2} lg={3} className="g-4">
          {reservations.map((item) => {
            // Récupère le prix peu importe le nom de la colonne renvoyée par l'API
            const rawPrice = item.price !== undefined ? item.price : item.painting_price;
            const formattedPrice = !isNaN(Number(rawPrice)) ? Number(rawPrice).toFixed(2) : '0.00';

            return (
              <Col key={item.id}>
                <Card className="h-100 border-0 shadow-sm overflow-hidden">
                  <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                    <Card.Img
                      variant="top"
                      src={
                        item.image_url && item.image_url.startsWith('http')
                          ? item.image_url
                          : `/images/${item.image_url}`
                      }
                      alt={item.painting_title || item.title || 'Tableau'}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                      <Badge bg={item.status === 'VALIDATED' ? 'success' : 'warning'} text={item.status === 'VALIDATED' ? 'white' : 'dark'}>
                        {item.status === 'VALIDATED' ? 'Validé' : 'Réservé'}
                      </Badge>
                    </div>
                  </div>

                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="font-serif fs-5 mb-1">
                      {item.painting_title || item.title || 'Œuvre originale'}
                    </Card.Title>
                    <Card.Text className="text-muted small mb-3">
                      {item.dimensions} — {item.technique}
                    </Card.Text>

                    <div className="mt-auto pt-3 border-top">
                      <p className="fw-bold text-primary mb-2">
                        {formattedPrice} €
                      </p>
                      <div className="p-2 bg-light rounded text-center">
                        <small className="text-dark fw-semibold">
                          {item.status === 'VALIDATED' 
                            ? 'Réservation validée par Sandrine Brend' 
                            : 'Réservation en attente de validation de Sandrine Brend'}
                        </small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default UserReservations;