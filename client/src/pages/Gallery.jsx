import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Gallery = () => {
  const [paintings, setPaintings] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // États pour la modale de détails
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate(); // Initialisation de navigate

  useEffect(() => {
    fetchPaintings();
  }, []);

  const fetchPaintings = async () => {
    try {
      const res = await API.get('/paintings');
      const items = res.data?.data || res.data?.paintings || (Array.isArray(res.data) ? res.data : []);
      setPaintings(items);
    } catch (err) {
      console.error('Erreur API Paintings :', err);
      setError('Impossible de charger les œuvres. Vérifiez votre serveur backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (painting) => {
    setSelectedPainting(painting);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPainting(null);
  };

  // Gestion du clic sur Réserver
  const handleReserve = (painting) => {
    const token = localStorage.getItem('token'); // Vérifie si l'utilisateur est connecté

    if (!token) {
      // S'il n'est pas connecté, on ferme la modale et on le redirige vers /login
      setShowModal(false);
      navigate('/login', { state: { from: '/gallery', paintingToReserve: painting } });
    } else {
      // S'il est connecté, on peut rediriger vers la page de réservation ou ouvrir le formulaire de réservation
      setShowModal(false);
      navigate('/reservation', { state: { painting } });
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
              <Card 
                className="h-100 border-0 shadow-sm overflow-hidden"
                style={{ cursor: 'pointer' }}
                onClick={() => handleCardClick(painting)}
              >
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
                    <span className="btn btn-outline-primary btn-sm">
                      Détails
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modale de détails du tableau */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        {selectedPainting && (
          <>
            <Modal.Header closeButton className="border-0 pb-0">
              <Modal.Title className="font-serif">{selectedPainting.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="align-items-center">
                <Col md={7} className="mb-3 mb-md-0">
                  <img
                    src={
                      selectedPainting.image_url && selectedPainting.image_url.startsWith('http')
                        ? selectedPainting.image_url
                        : `/images/${selectedPainting.image_url}`
                    }
                    alt={selectedPainting.title}
                    className="img-fluid rounded shadow-sm w-100"
                    style={{ maxHeight: '450px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                  />
                </Col>
                <Col md={5} className="d-flex flex-column justify-content-between">
                  <div>
                    <div className="mb-3">
                      {renderStatusBadge(selectedPainting.status)}
                    </div>
                    <p className="text-muted mb-2">
                      <strong>Dimensions :</strong> {selectedPainting.dimensions}
                    </p>
                    <p className="text-muted mb-2">
                      <strong>Technique :</strong> {selectedPainting.technique}
                    </p>
                    {selectedPainting.description && (
                      <p className="text-muted small mt-3 mb-3">
                        {selectedPainting.description}
                      </p>
                    )}
                  </div>
                  <div className="pt-3 border-top d-flex align-items-center justify-content-between">
                    <span className="fw-bold fs-4 text-primary">
                      {Number(selectedPainting.price).toFixed(2)} €
                    </span>
                    {selectedPainting.status === 'AVAILABLE' && (
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleReserve(selectedPainting)}
                      >
                        Réserver
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            </Modal.Body>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default Gallery;