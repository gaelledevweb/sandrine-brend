import React from 'react';
import { Container } from 'react-bootstrap';

const PrivacyPolicy = () => {
  return (
    <Container className="py-5" style={{ minHeight: '80vh' }}>
      <h1 className="font-serif mb-4 text-center">Politique de Confidentialité</h1>
      
      <div className="bg-white p-4 p-md-5 rounded shadow-sm border border-light">
        <section className="mb-4">
          <h2 className="h4 font-serif text-primary mb-3">1. Collecte des données personnelles</h2>
          <p>
            Dans le cadre de l'utilisation du site, nous pouvons être amenés à collecter les données personnelles suivantes :
          </p>
          <ul>
            <li>Nom et prénom</li>
            <li>Adresse e-mail</li>
            <li>Numéro de téléphone (optionnel)</li>
            <li>Contenu du message transmis via le formulaire de contact ou de réservation</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="h4 font-serif text-primary mb-3">2. Utilisation des données</h2>
          <p>
            Les données recueillies sont strictement destinées aux usages suivants :
          </p>
          <ul>
            <li>Répondre à vos demandes d'information via le formulaire de contact</li>
            <li>Traiter et gérer vos demandes de réservation d'oeuvres d'art</li>
            <li>Assurer le suivi de la relation client avec Sandrine Brend</li>
          </ul>
        </section>

        <section className="mb-4">
          <h2 className="h4 font-serif text-primary mb-3">3. Conservation des données</h2>
          <p>
            Vos données personnelles sont conservées uniquement pendant la durée nécessaire à la gestion administrative de votre demande ou pour répondre à nos obligations légales. Elles sont stockées de façon sécurisée et ne sont en aucun cas vendues, louées ou cédées à des tiers.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="h4 font-serif text-primary mb-3">4. Sécurité des données</h2>
          <p>
            Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte, altération ou divulgation.
          </p>
        </section>

        <section className="mb-4">
          <h2 className="h4 font-serif text-primary mb-3">5. Vos droits (RGPD)</h2>
          <p>
            Conformément à la réglementation européenne (RGPD), vous disposez des droits suivants concernant vos données personnelles :
          </p>
          <ul>
            <li>Droit d'accès et de rectification</li>
            <li>Droit à l'effacement (« droit à l'oubli »)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit d'opposition au traitement</li>
          </ul>
          <p>
            Pour exercer l'un de ces droits, vous pouvez contacter directement Sandrine Brend par e-mail à : <strong>sandrine.brend.peintures@gmail.com</strong>.
          </p>
        </section>

        <section className="mb-0">
          <h2 className="h4 font-serif text-primary mb-3">6. Modifications de la politique</h2>
          <p className="mb-0">
            Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment afin de garantir sa conformité avec le droit en vigueur.
          </p>
        </section>
      </div>
    </Container>
  );
};

export default PrivacyPolicy;