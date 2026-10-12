import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Gallery = () => {
  const [paintings, setPaintings] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPaintings();
  }, []);

  const fetchPaintings = async () => {
    try {
      const res = await API.get('/paintings');
      console.log('Réponse API Paintings :', res.data);

      // Le backend renvoie { success: true, count: 19, data: [...] } ou { paintings: [...] }
      const items = res.data?.data || res.data?.paintings || (Array.isArray(res.data) ? res.data : []);
      setPaintings(items);
    } catch (err) {
      console.error('Erreur API Paintings :', err);
      setError('Impossible de charger les œuvres. Vérifiez votre serveur backend.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPaintings = paintings.filter((painting) => {
    if (filter === 'ALL') return true;
    return painting.status === filter;
  });

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge bg="success">Disponible</Badge>;
      case 'RESERVED':
        return <Badge bg="warning" text="dark">Réservé</Badge>;
      case 'SOLD':
        return <Badge bg="secondary">Vendu</Badge>;
      default:
        return null;
    }
  };

  return (
    <Container className="py-5">
      <h1 className="font-serif text-center mb-2">Galerie d'Œuvres</h1>
      <p className="text-center text-muted mb-4">
        Découvrez les créations originales de Sandrine Brend
      </p>

      {/* Boutons de filtres */}
      <div className="d-flex justify-content-center gap-2 mb-5">
        <Button
          variant={filter === 'ALL' ? 'dark' : 'outline-dark'}
          size="sm"
          onClick={() => setFilter('ALL')}
        >
          Tous ({paintings.length})
        </Button>
        <Button
          variant={filter === 'AVAILABLE' ? 'success' : 'outline-success'}
          size="sm"
          onClick={() => setFilter('AVAILABLE')}
        >
          Disponibles
        </Button>
        <Button
          variant={filter === 'RESERVED' ? 'warning' : 'outline-warning'}
          size="sm"
          onClick={() => setFilter('RESERVED')}
        >
          Réservés
        </Button>
        <Button
          variant={filter === 'SOLD' ? 'secondary' : 'outline-secondary'}
          size="sm"
          onClick={() => setFilter('SOLD')}
        >
          Vendus
        </Button>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Chargement des tableaux...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && paintings.length === 0 && (
        <p className="text-center text-muted py-4">Aucun tableau trouvé.</p>
      )}

      {!loading && !error && (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredPaintings.map((painting) => (
            <Col key={painting.id}>
              <Card className="h-100 border-0 shadow-sm overflow-hidden">
                <div style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                  <Card.Img
                    variant="top"
                    src={
                      painting.image_url && painting.image_url.startsWith('http')
                        ? painting.image_url
                        : `/images/${painting.image_url}`
                    }
                    alt={painting.title}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    {renderStatusBadge(painting.status)}
                  </div>
                </div>

                <Card.Body className="d-flex flex-column">
                  <Card.Title className="font-serif fs-5 mb-1">{painting.title}</Card.Title>
                  <Card.Text className="text-muted small mb-2">
                    {painting.dimensions} — {painting.technique}
                  </Card.Text>

                  <div className="mt-auto d-flex align-items-center justify-content-between pt-3 border-top">
                    <span className="fw-bold fs-5">{Number(painting.price).toFixed(2)} €</span>
                    <Link
                      to={`/paintings/${painting.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      Détails
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Gallery;