import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BsNavbar expand="lg" className="navbar-custom sticky-top py-2">
      <Container>
        <BsNavbar.Brand as={Link} to="/">
          <img src={logoImg} alt="Logo Sandrine Brend" />
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={NavLink} to="/" end>Accueil</Nav.Link>
            <Nav.Link as={NavLink} to="/gallery">Galerie</Nav.Link>
            <Nav.Link as={NavLink} to="/about">À Propos</Nav.Link>
            <Nav.Link as={NavLink} to="/contact">Contact</Nav.Link>
            
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Nav.Link as={NavLink} to="/admin" className="fw-bold text-primary">
                    Espace Artiste
                  </Nav.Link>
                ) : (
                  <Nav.Link as={NavLink} to="/reservations" className="fw-bold text-primary">
                    Mes Réservations
                  </Nav.Link>
                )}
                <Button variant="outline-danger" size="sm" className="ms-2" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <Nav.Link as={NavLink} to="/login" className="ms-lg-2">
                <Button variant="outline-primary" size="sm">Connexion</Button>
              </Nav.Link>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default NavigationBar;