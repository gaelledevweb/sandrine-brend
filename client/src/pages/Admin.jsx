import React, { useState, useEffect } from 'react';
import { Container, Table, Badge, Button, Alert, Spinner, Tab, Tabs, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Admin = () => {
  const [reservations, setReservations] = useState([]);
  const [paintings, setPaintings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // États pour le formulaire d'ajout d'oeuvre
  const [newPainting, setNewPainting] = useState({
    title: '',
    dimensions: '',
    technique: '',
    price: '',
    status: 'AVAILABLE'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

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
      let resContacts = [];

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

      try {
        const r3 = await API.get('/contact');
        resContacts = r3.data?.data || r3.data?.contacts || r3.data || [];
      } catch (err) {
        console.error("Erreur chargement messages de contact :", err);
      }

      setReservations(resReservations);
      setPaintings(resPaintings);
      setContacts(resContacts);
    } catch (err) {
      console.error('Erreur globale admin :', err);
      setError('Impossible de charger les données administrateur.');
    } finally {
      setLoading(false);
    }
  };

  // Gestion du Glisser-Déposer
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Soumission du formulaire d'ajout d'une oeuvre
  const handleCreatePainting = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Veuillez sélectionner ou glisser une image pour le tableau.");
      return;
    }

    const formData = new FormData();
    formData.append('title', newPainting.title);
    formData.append('dimensions', newPainting.dimensions);
    formData.append('technique', newPainting.technique);
    formData.append('price', newPainting.price);
    formData.append('status', newPainting.status);
    formData.append('image', imageFile);

    try {
      setSubmitting(true);
      await API.post('/paintings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccessMsg("Œuvre ajoutée avec succès !");
      setNewPainting({ title: '', dimensions: '', technique: '', price: '', status: 'AVAILABLE' });
      setImageFile(null);
      setImagePreview(null);
      fetchAdminData();

      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error("Erreur lors de l'ajout du tableau :", err);
      alert("Erreur lors de l'enregistrement de l'œuvre.");
    } finally {
      setSubmitting(false);
    }
  };

  // Valider une réservation
  const handleValidateReservation = async (id) => {
    if (!window.confirm("Confirmer et valider cette vente/réservation ? Le tableau passera en statut 'Vendu'.")) return;
    try {
      await API.put(`/reservations/${id}/validate`);
      fetchAdminData();
    } catch (err) {
      alert("Erreur lors de la validation de la réservation.");
    }
  };

  const handleDeleteReservation = async (id) => {
    if (!window.confirm("Voulez-vous annuler/supprimer cette demande ? (Le tableau sera remis disponible)")) return;
    try {
      await API.delete(`/reservations/${id}`);
      fetchAdminData();
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
      alert("Erreur lors de l'ossibilité de supprimer l'œuvre.");
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm("Voulez-vous supprimer ce message ?")) return;
    try {
      await API.delete(`/contact/${id}`);
      setContacts(contacts.filter(c => c.id !== id));
      fetchAdminData();
    } catch (err) {
      // Si la route delete n'existe pas encore côté backend, on met à jour localement
      setContacts(contacts.filter(c => c.id !== id));
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
        Gérez vos réservations, vos messages de contact, vos œuvres et ajoutez de nouvelles créations
      </p>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

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
                              <Button variant="outline-success" size="sm" onClick={() => handleValidateReservation(item.id)}>
                                Valider
                              </Button>
                            )}
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteReservation(item.id)}>
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

        {/* Onglet messages de contact */}
        <Tab eventKey="contacts" title={`Messages (${contacts.length})`}>
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-serif mb-4">Messages reçus via le formulaire de contact</h3>
            {contacts.length === 0 ? (
              <p className="text-muted text-center py-3">Aucun message de contact pour le moment.</p>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Sujet</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((msg) => (
                      <tr key={msg.id}>
                        <td><strong>{msg.name}</strong></td>
                        <td>
                          <a href={`mailto:${msg.email}`}>{msg.email}</a>
                        </td>
                        <td>{msg.subject}</td>
                        <td><small style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</small></td>
                        <td><small>{msg.created_at ? new Date(msg.created_at).toLocaleDateString() : '-'}</small></td>
                        <td className="text-end">
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteContact(msg.id)}>
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

        {/* Onglet Ajouter une oeuvre (Glisser-Déposer) */}
        <Tab eventKey="add" title="Ajouter une œuvre">
          <div className="bg-white p-4 rounded shadow-sm">
            <h3 className="font-serif mb-4">Ajouter un nouveau tableau</h3>
            <Form onSubmit={handleCreatePainting}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Titre de l'œuvre</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={newPainting.title}
                      onChange={(e) => setNewPainting({ ...newPainting, title: e.target.value })}
                      placeholder="Ex: Harmonie Bleue"
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Prix (€)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      required
                      value={newPainting.price}
                      onChange={(e) => setNewPainting({ ...newPainting, price: e.target.value })}
                      placeholder="Ex: 450"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Dimensions</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={newPainting.dimensions}
                      onChange={(e) => setNewPainting({ ...newPainting, dimensions: e.target.value })}
                      placeholder="Ex: 60x80 cm"
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Technique</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={newPainting.technique}
                      onChange={(e) => setNewPainting({ ...newPainting, technique: e.target.value })}
                      placeholder="Ex: Acrylique sur toile"
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Zone Glisser-Déposer */}
              <Form.Group className="mb-4">
                <Form.Label>Image de l'œuvre</Form.Label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: '30px',
                    textAlign: 'center',
                    backgroundColor: isDragging ? '#f8f9fa' : '#fff',
                    cursor: 'pointer'
                  }}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  {imagePreview ? (
                    <div>
                      <img src={imagePreview} alt="Aperçu" style={{ maxHeight: '150px', objectFit: 'contain' }} className="mb-2 rounded" />
                      <p className="text-muted small mb-0">Cliquez ou glissez une autre image pour remplacer</p>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-1 text-muted">Glissez-déposez votre image ici, ou <strong>cliquez pour parcourir</strong></p>
                      <small className="text-secondary">(Formats acceptés : JPG, PNG, WEBP)</small>
                    </div>
                  )}
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />
                </div>
              </Form.Group>

              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? 'Envoi en cours...' : 'Publier l\'œuvre'}
              </Button>
            </Form>
          </div>
        </Tab>

        {/* Onglet galerie / gestion */}
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
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeletePainting(painting.id)}>
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