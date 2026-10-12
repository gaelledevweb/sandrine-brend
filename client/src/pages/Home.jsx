import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import heroImg from '../assets/présentation.jpg';

const Home = () => {
  return (
    <div>
      {/* Bannière */}
      <section className="hero-section py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 font-serif mb-3">Sandrine Brend</h1>
              <p className="lead text-muted mb-4">
                L'art d'exprimer l'émotion à travers la couleur et la matière.
              </p>
              <p className="mb-4">
                Explorez des toiles poétiques et uniques. Chaque création est une invitation au voyage intérieur.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/gallery" variant="primary" size="lg">
                  Découvrir la Galerie
                </Button>
                <Button as={Link} to="/contact" variant="outline-primary" size="lg">
                  Me Contacter
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <img 
                src={heroImg} 
                alt="Présentation Sandrine Brend" 
                className="img-fluid hero-img rounded shadow" 
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Section présentation */}
      <section className="py-5 bg-white">
        <Container className="text-center">
          <Row className="justify-content-center">
            <Col md={8}>
              <h2 className="font-serif mb-3">Bienvenue dans mon Univers</h2>
              <p className="text-muted">
                Découvrez des collections variées façonnées par la passion et le souci du détail. Vous pouvez réserver vos coups de cœur directement en ligne ou planifier une visite d'atelier.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;