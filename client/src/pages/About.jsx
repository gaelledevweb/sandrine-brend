import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import presentationImg from '../assets/présentation2.jpg';

const About = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center mb-5">
        <Col lg={8}>
          <h1 className="font-serif mb-3">
            L'élégance du souffle et de la lumière
          </h1>
          <p className="text-muted lead" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            À travers des toiles acryliques empreintes d'onirisme et de délicatesse, je capture la beauté fugace de la nature et du mouvement suspendu. Mon style unique, caractérisé par des fonds vaporeux, des transparences lumineuses et des touches aériennes, insuffle une poésie intemporelle à chaque composition. Posséder une de mes œuvres, c'est s'offrir une parenthèse de sérénité et d'évasion visuelle au cœur de la matière.
          </p>
        </Col>
      </Row>

      {/* Section principale */}
      <Row className="align-items-center g-5 mb-5">
        <Col lg={6}>
          <div className="position-relative shadow rounded overflow-hidden">
            <img
              src={presentationImg} 
              alt="Atelier de Sandrine Brend"
              className="img-fluid w-100"
              style={{ objectFit: 'cover', maxHeight: '550px' }}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="ps-lg-3">
            <h2 className="font-serif mb-3 text-dark">Mes œuvres se distinguent par une signature visuelle unique :</h2>
            
            <ul className="list-unstyled text-muted mb-4" style={{ lineHeight: '1.8' }}>
              <li className="mb-3">
                <strong>Un style vaporeux et lumineux :</strong> Grâce à un subtil travail de superpositions, de lavis et de transparences, les fonds texturés aux teintes poudrées (rose, pêche, bleu tendre) respirent et créent une profondeur enveloppante.
              </li>
              <li className="mb-3">
                <strong>La délicatesse du vivant :</strong> Que ce soient des branches fleuries frôlant le vent, des pissenlits prêts à s'envoler ou la silhouette éthérée d'une robe de danse, je célèbre la beauté organique et la fragilité poétique du monde.
              </li>
              <li className="mb-3">
                <strong>L'alliance de la structure et de la spontanéité :</strong> Mes compositions allient la finesse de traits directeurs à une liberté de geste marquée par de délicates éclaboussures (« splatters »), évoquant la rosée du matin ou des pétales emportés par l'air.
              </li>
            </ul>
          </div>
        </Col>
      </Row>

      {/* Section pourquoi collectionner */}
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="border-0 shadow-sm bg-light p-4 p-md-5 text-center rounded-3">
            <Card.Body>
              <h3 className="font-serif mb-3">Pourquoi collectionner ou acquérir une œuvre de Sandrine Brend ?</h3>
              <p className="text-muted mb-4" style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.7' }}>
                Idéales pour insuffler calme, élégance et sérénité dans un intérieur, ses peintures ne se contentent pas de décorer : elles invitent à la contemplation et racontent des histoires de vent, de lumière et de nature. <br />
                Offrez à votre espace de vie une bouffée d'art poétique et intemporel.
              </p>
              <a href="/gallery" className="btn btn-dark px-4 py-2">
                Découvrir la galerie
              </a>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;