import React from 'react';
import { Container } from 'react-bootstrap';

const Legal = () => {
    return (
        <Container className="py-5" style={{ minHeight: '80vh' }}>
            <h1 className="font-serif mb-4 text-center">Mentions Légales</h1>

            <div className="bg-white p-4 p-md-5 rounded shadow-sm border border-light">
                <section className="mb-4">
                    <h2 className="h4 font-serif text-primary mb-3">1. Édition du site</h2>
                    <p>
                        Le présent site internet est édité par :<br />
                        <strong>Sandrine Brend</strong> — Artiste Peintre<br />
                        SIRET : En cours d'immatriculation<br />
                        Adresse : Le Mans, France<br />
                        Email : sandrine.brend.peintures@gmail.com<br />
                        Téléphone : 0612345678
                    </p>
                </section>

                <section className="mb-4">
                    <h2 className="h4 font-serif text-primary mb-3">2. Hébergement</h2>
                    <p>
                        <strong>Hébergement Frontend (Interface utilisateur) :</strong><br />
                        <strong>Vercel Inc.</strong><br />
                        Adresse : 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br />
                        Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">https://vercel.com</a>
                    </p>
                    <p className="mb-0">
                        <strong>Hébergement Backend (API et serveur) :</strong><br />
                        <strong>Render Services, Inc.</strong><br />
                        Adresse : 525 Brannan St, Suite 300, San Francisco, CA 94107, États-Unis<br />
                        Site web : <a href="https://render.com" target="_blank" rel="noopener noreferrer">https://render.com</a>
                    </p>
                </section>

                <section className="mb-4">
                    <h2 className="h4 font-serif text-primary mb-3">3. Propriété intellectuelle</h2>
                    <p>
                        L'ensemble des contenus présents sur ce site (textes, peintures, œuvres graphiques, photographies, logos, visuels) sont la propriété exclusive de Sandrine Brend, sauf mention contraire.
                    </p>
                    <p>
                        Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces différents éléments est strictement interdite sans l'accord exprès par écrit de Sandrine Brend.
                    </p>
                </section>

                <section className="mb-4">
                    <h2 className="h4 font-serif text-primary mb-3">4. Protection des données personnelles (RGPD)</h2>
                    <p>
                        Les informations recueillies via le formulaire de contact ou les demandes de réservation (nom, adresse email, message) sont enregistrées dans un fichier informatisé afin de répondre à vos demandes et gérer vos réservations d'œuvres.
                    </p>
                    <p>
                        Ces données sont conservées de manière sécurisée et ne sont en aucun cas transmises ou revendues à des tiers. Conformément à la loi « Informatique et Libertés » et au RGPD, vous pouvez exercer votre droit d'accès, de rectification ou de suppression des données vous concernant en contactant : <strong>sandrine.brend.peintures@gmail.com</strong>.
                    </p>
                </section>

                <section className="mb-0">
                    <h2 className="h4 font-serif text-primary mb-3">5. Cookies</h2>
                    <p className="mb-0">
                        Ce site n'utilise pas de cookies publicitaires ou de traçage commercial à des fins de ciblage. Seuls des cookies strictement nécessaires au bon fonctionnement de la navigation ou de la session peuvent être déposés.
                    </p>
                </section>
            </div>
        </Container>
    );
};

export default Legal;