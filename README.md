Sandrine Brend — Portfolio et Galerie d'Art

Projet fullstack de présentation et de gestion des œuvres d'art de Sandrine Brend.

Architecture
- **client/** : Frontend React (Vite)
- **server/** : Backend API REST Node.js / Express
- **database/** : Scripts SQL et schéma BDD

Hébergement : 
- Frontend via Vercel : https://sandrine-brend.vercel.app/
- Backend via Render : https://sandrine-brend-backend.onrender.com
- Base de données : Aiven (MySQL), Cloud MySQL Managed (Accès SSL sécurisé)
- Gestion des médias : Cloudinary, CDN média et optimisation WebP

Installation
1. Backend : `cd server && npm install`
2. Frontend : `cd client && npm install`
3. Exécuter le seed BDD : `cd server && npm run seed`
4. Démarrer le serveur : `cd server && npm run dev`
5. Démarrer le client : `cd client && npm run dev`