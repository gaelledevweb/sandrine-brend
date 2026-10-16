import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import API from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      // Envoi des données vers l'API
      await API.post('/contact', formData);
      setSuccessMsg("Votre message a bien été envoyé. Je vous répondrai dans les plus brefs délais.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err);
      setErrorMsg("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer ultérieurement.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <h1 className="font-serif text-center mb-2">Contactez-moi</h1>
      <p className="text-center text-muted mb-5">
        Une question sur une œuvre, un projet artistique sur mesure ou une acquisition ? N'hésitez pas à m'écrire.
      </p>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="bg-white p-4 p-md-5 rounded shadow-sm">
            {successMsg && <Alert variant="success">{successMsg}</Alert>}
            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Votre nom</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Marie Dupont"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Votre adresse email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ex: marie.dupont@exemple.com"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Sujet</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Ex: Renseignements sur une œuvre"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Votre message..."
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100" disabled={submitting}>
                {submitting ? 'Envoi en cours...' : 'Envoyer le message'}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;