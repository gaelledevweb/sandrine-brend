import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Footer = () => {
  const { user } = useContext(AuthContext);

  return (
    <footer className="footer-custom py-5 mt-auto">
      <Container>
        <Row className="gy-4 justify-content-lg-between">
          {/* Présentation */}
          <Col lg={4} md={6}>
            <h5 className="font-serif footer-title mb-2">Sandrine Brend</h5>
            <p className="footer-text small mb-3">
              Artiste peintre proposant des œuvres originales, uniques et empreintes de sensibilité.
            </p>
            <p className="footer-text small mb-0">
              &copy; {new Date().getFullYear()} Sandrine Brend — Tous droits réservés.
            </p>
          </Col>

          {/* Navigation */}
          <Col lg={3} md={6}>
            <h6 className="text-uppercase footer-heading mb-3">Navigation</h6>
            <ul className="list-unstyled footer-list mb-0">
              <li><Link to="/" className="footer-link">Accueil</Link></li>
              <li><Link to="/gallery" className="footer-link">Galerie d'Art</Link></li>
              <li><Link to="/about" className="footer-link">À Propos</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
              <li>
                {user ? (
                  user.role === 'admin' ? (
                    <Link to="/admin" className="footer-link">Espace Artiste (Admin)</Link>
                  ) : (
                    <Link to="/profile" className="footer-link">Mon Compte</Link>
                  )
                ) : (
                  <Link to="/login" className="footer-link">Connexion / Inscription</Link>
                )}
              </li>
            </ul>
          </Col>

          {/* Informations légales */}
          <Col lg={3} md={12}>
            <h6 className="text-uppercase footer-heading mb-3">Informations Légales</h6>
            <ul className="list-unstyled footer-list mb-0">
              <li><Link to="/mentions-legales" className="footer-sublink">Mentions Légales</Link></li>
              <li><Link to="/politique-de-confidentialite" className="footer-sublink">Politique de Confidentialité</Link></li>
              <li>
                <button 
                  onClick={() => alert("Gestionnaire de cookies : Seuls les cookies essentiels au fonctionnement du site sont utilisés.")} 
                  className="footer-sublink btn btn-link p-0 text-decoration-none text-start align-baseline"
                >
                  Gestion des Cookies
                </button>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;