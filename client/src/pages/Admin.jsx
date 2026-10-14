import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Alert, Spinner, Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Admin = () => {
  const [reservations, setReservations] = useState([]);
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role !== 'admin') {
          navigate('/gallery');
          return;
        }
      } catch (e) {
        console.error("Erreur parsing user", e);
      }
    }

    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      let resReservations = [];
      let resPaintings = [];

      try {
        const r1 = await API.get('/reservations');
        resReservations = r1.data?.data || r1.data?.reservations || r1.data || [];
      } catch (err) {
        console.error("Erreur chargement réservations admin :", err);
      }

      try {
        const r2 = await API.get('/paintings');
        resPaintings = r2.data?.data || r2.data?.paintings || r2.data || [];
      } catch (err) {
        console.error("Erreur chargement tableaux admin :", err);
      }

      setReservations(resReservations);
      setPaintings(resPaintings);
    } catch (err) {
      console.error('Erreur globale admin :', err);
      setError('Impossible de charger les données administrateur.');
    } finally {
      setLoading(false);
    }
  };

  // Valider une réservation
  const handleValidateReservation = async (id) => {
    if (!window.confirm("Confirmer et valider cette vente/réservation ? Le tableau passera en statut 'Vendu'.")) return;
    try {
      await API.put(`/reservations/${id}/validate`);
      
      // Mise à jour visuelle instantanée dans l'interface sans attendre le rechargement complet
      setReservations(prevReservations =>
        prevReservations.map(item =>
          item.id === id ? { ...item, status: 'VALIDATED' } : item
        )
      );

      fetchAdminData(); // Recharge les listes en arrière-plan (mettra à jour le statut du tableau dans l'onglet des œuvres)
    } catch (err) {
      alert("Erreur lors de la validation de la réservation.");
    }
  };

  // Supprimer, refuser une réservation
  const handleDeleteReservation = async (id) => {
    if (!window.confirm("Voulez-vous annuler/supprimer cette demande ? (Le tableau sera remis disponible)")) return;
    try {
      await API.delete(`/reservations/${id}`);
      setReservations(prevReservations => prevReservations.filter(item => item.id !== id));
      fetchAdminData(); // Recharge les listes
    } catch (err) {
      alert("Erreur lors de la suppression de la réservation.");
    }
  };

  const handleDeletePainting = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cette œuvre ?")) return;
    try {
      await API.delete(`/paintings/${id}`);
      setPaintings(paintings.filter(p => p.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression de l'œuvre.");
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Chargement de l'espace artiste...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="font-serif text-center mb-2">Espace Artiste - Administration</h1>
      <p className="text-center text-muted mb-5">
        Gérez vos réservations et vos œuvres
      </p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Tabs defaultActiveKey="reservations" className="mb-4" fill>
        {/* Onglet réservations */}
        <Tab eventKey="reservations" title={`Demandes (${reservations.length})`}>
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-serif mb-4">Demandes de réservation clients</h3>
            {reservations.length === 0 ? (
              <p className="text-muted text-center py-3">Aucune réservation pour le moment.</p>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Œuvre</th>
                      <th>Client</th>
                      <th>Contact</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Statut</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {item.image_url && (
                              <img
                                src={item.image_url.startsWith('http') ? item.image_url : `/images/${item.image_url}`}
                                alt=""
                                style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                                className="rounded"
                              />
                            )}
                            <div>
                              <strong>{item.painting_title || 'Tableau'}</strong>
                              <br />
                              <small className="text-muted">{item.painting_price} €</small>
                            </div>
                          </div>
                        </td>
                        <td>{item.client_name}</td>
                        <td>
                          <a href={`mailto:${item.client_email}`}>{item.client_email}</a>
                          <br />
                          <small className="text-muted">{item.client_phone || 'Pas de téléphone'}</small>
                        </td>
                        <td><small>{item.message || '-'}</small></td>
                        <td><small>{new Date(item.created_at).toLocaleDateString()}</small></td>
                        <td>
                          <Badge bg={item.status === 'VALIDATED' ? 'success' : 'warning'} text={item.status === 'VALIDATED' ? 'white' : 'dark'}>
                            {item.status === 'VALIDATED' ? 'Validé' : 'En attente'}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <div className="d-flex gap-2 justify-content-end">
                            {item.status !== 'VALIDATED' && (
                              <Button 
                                variant="outline-success" 
                                size="sm"
                                onClick={() => handleValidateReservation(item.id)}
                              >
                                Valider
                              </Button>
                            )}
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteReservation(item.id)}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </Tab>

        {/* Onglet galerie */}
        <Tab eventKey="paintings" title={`Mes Œuvres (${paintings.length})`}>
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-serif mb-4">Gestion de la galerie</h3>
            {paintings.length === 0 ? (
              <p className="text-muted text-center py-3">Aucun tableau enregistré.</p>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Image</th>
                      <th>Titre</th>
                      <th>Prix</th>
                      <th>Statut</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paintings.map((painting) => (
                      <tr key={painting.id}>
                        <td>
                          <img
                            src={painting.image_url && painting.image_url.startsWith('http') ? painting.image_url : `/images/${painting.image_url}`}
                            alt={painting.title}
                            style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                            className="rounded"
                          />
                        </td>
                        <td><strong>{painting.title}</strong></td>
                        <td>{Number(painting.price).toFixed(2)} €</td>
                        <td>
                          <Badge bg={
                            painting.status === 'AVAILABLE' ? 'success' : 
                            painting.status === 'SOLD' ? 'danger' : 'warning'
                          }>
                            {painting.status === 'SOLD' ? 'Vendu' : painting.status}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeletePainting(painting.id)}
                          >
                            Supprimer
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Admin;