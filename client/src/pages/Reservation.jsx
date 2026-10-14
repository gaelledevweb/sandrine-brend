import React, { useState, useContext } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Reservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Récupère le tableau passé en paramètre depuis la galerie
  const painting = location.state?.painting;

  // Pré-remplit les champs avec les infos de l'utilisateur s'il est connecté
  const [formData, setFormData] = useState({
    client_name: user?.username || user?.name || '',
    client_email: user?.email || '',
    client_phone: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Si aucun tableau n'a été sélectionné, on affiche un message d'avertissement
  if (!painting) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning" className="d-inline-block px-4">
          Aucun tableau n'a été sélectionné pour la réservation.
        </Alert>
        <div className="mt-3">
          <Link to="/gallery" className="btn btn-primary">
            Retourner à la galerie
          </Link>
        </div>
      </Container>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Appel API POST vers /reservations
      const res = await API.post('/reservations', {
        painting_id: painting.id,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        message: formData.message,
      });

      if (res.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      console.error('Erreur réservation :', err);
      setError(
        err.response?.data?.message ||
          "Une erreur est survenue lors de l'enregistrement de votre réservation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h1 className="font-serif text-center mb-4">Réserver une Œuvre</h1>

      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm border-0 overflow-hidden">
            <Row className="g-0">
              {/* Image et résumé du tableau */}
              <Col md={5} className="bg-light p-4 d-flex flex-column align-items-center justify-content-center">
                <img
                  src={
                    painting.image_url && painting.image_url.startsWith('http')
                      ? painting.image_url
                      : `/images/${painting.image_url}`
                  }
                  alt={painting.title}
                  className="img-fluid rounded shadow-sm mb-3"
                  style={{ maxHeight: '250px', objectFit: 'contain' }}
                />
                <h4 className="font-serif text-center">{painting.title}</h4>
                <p className="text-muted small text-center mb-1">
                  {painting.dimensions} — {painting.technique}
                </p>
                <p className="fw-bold text-primary fs-5 mb-0">
                  {Number(painting.price).toFixed(2)} €
                </p>
              </Col>

              {/* Formulaire de réservation */}
              <Col md={7} className="p-4">
                {success ? (
                  <div className="text-center py-4">
                    <Alert variant="success">
                      <Alert.Heading>Demande envoyée !</Alert.Heading>
                      <p className="mb-0">
                        Votre demande de réservation pour <strong>{painting.title}</strong> a bien été enregistrée. L'artiste vous recontactera rapidement.
                      </p>
                    </Alert>
                    <Button variant="primary" onClick={() => navigate('/gallery')} className="mt-3">
                      Retourner à la galerie
                    </Button>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <h5 className="mb-3">Vos coordonnées</h5>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form.Group className="mb-3" controlId="client_name">
                      <Form.Label>Nom complet *</Form.Label>
                      <Form.Control
                        type="text"
                        required
                        placeholder="Votre nom"
                        value={formData.client_name}
                        onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="client_email">
                      <Form.Label>Adresse Email *</Form.Label>
                      <Form.Control
                        type="email"
                        required
                        placeholder="exemple@email.com"
                        value={formData.client_email}
                        onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="client_phone">
                      <Form.Label>Téléphone</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="06 12 34 56 78"
                        value={formData.client_phone}
                        onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="message">
                      <Form.Label>Message (optionnel)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Précisez votre demande ou vos disponibilités..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 py-2" disabled={loading}>
                      {loading ? 'Envoi en cours...' : 'Confirmer la réservation'}
                    </Button>
                  </Form>
                )}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Reservation;