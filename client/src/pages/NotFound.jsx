import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center text-center py-5" style={{ minHeight: '70vh' }}>
      <h1 className="display-1 font-serif text-primary fw-bold">404</h1>
      <h2 className="font-serif mb-3">Page non trouvée</h2>
      <p className="text-muted mb-4" style={{ maxWidth: '500px' }}>
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Button as={Link} to="/" variant="outline-dark" className="px-4 py-2">
        Retourner à l'accueil
      </Button>
    </Container>
  );
};

export default NotFound;