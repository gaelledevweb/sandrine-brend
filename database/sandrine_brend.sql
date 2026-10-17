-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 17 oct. 2026 à 10:22
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SESSION sql_require_primary_key = OFF;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `sandrine_brend`
--

-- --------------------------------------------------------

--
-- Structure de la table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `admins`
--

INSERT INTO `admins` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'admin', 'sandrine.brend.peintures@gmail.com', '$2b$10$IgkZsZU8KguozrXbyux0/OJwPKBz/ir1ZkvZUZVtuDiF6YP.O1C42', '2026-10-07 15:13:22');

-- --------------------------------------------------------

--
-- Structure de la table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `subject`, `message`, `is_read`, `created_at`) VALUES
(1, 'Gaelle Mancuso', 'gaelle.devweb72@gmail.com', 'demande d\'information', 'Bonjour,\nEst-il possible de vous commander un tableau personnalisé?\nCordialement', 0, '2026-10-14 17:27:55'),
(2, 'John Doe', 'johndoe@xxx.com', 'commande tableau', 'Je souhaite avoir un tableau en exclusivité', 0, '2026-10-15 15:21:09');

-- --------------------------------------------------------

--
-- Structure de la table `paintings`
--

CREATE TABLE `paintings` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `dimensions` varchar(100) NOT NULL,
  `technique` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` enum('AVAILABLE','RESERVED','SOLD') DEFAULT 'AVAILABLE',
  `image_url` varchar(255) NOT NULL,
  `cloudinary_public_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `paintings`
--

INSERT INTO `paintings` (`id`, `title`, `dimensions`, `technique`, `price`, `status`, `image_url`, `cloudinary_public_id`, `created_at`) VALUES
(1, 'Cercle de tendresse', 'Diamètre 40 cm (Tondo)', 'Huile sur toile', 380.00, 'AVAILABLE', 'cercle_de_tendresse.jpg', 'cercle_de_tendresse', '2026-10-12 14:29:44'),
(2, 'Chuchotements floraux', '80x60 cm', 'Technique mixte sur canvas', 520.00, 'AVAILABLE', 'chuchotements_floraux.jpg', 'chuchotements_floraux', '2026-10-12 14:29:44'),
(3, 'Danse cosmique', '100x80 cm', 'Huile et pigment sur toile', 750.00, 'AVAILABLE', 'danse_cosmique.jpg', 'danse_cosmique', '2026-10-12 14:29:44'),
(4, 'Douceur printanière', '70x50 cm', 'Aquarelle et encre sur toile', 450.00, 'AVAILABLE', 'douceur_printaniere.jpg', 'douceur_printaniere', '2026-10-12 14:29:44'),
(5, 'Éphéméride végétale', '60x80 cm', 'Technique mixte', 490.00, 'AVAILABLE', 'ephemeride_vegetale.jpg', 'ephemeride_vegetale', '2026-10-12 14:29:44'),
(6, 'Floraison d\'étoiles', '120x90 cm', 'Huile et dorure sur toile', 890.00, 'AVAILABLE', 'floraison_detoiles.jpg', 'floraison_detoiles', '2026-10-12 14:29:44'),
(7, 'Floraison incandescente', '100x70 cm', 'Huile sur chassis', 680.00, 'AVAILABLE', 'floraison_incandescente.jpg', 'floraison_incandescente', '2026-10-12 14:29:44'),
(8, 'Harmonie florale', '80x80 cm', 'Technique mixte', 580.00, 'AVAILABLE', 'harmonie_florale.jpg', 'harmonie_florale', '2026-10-12 14:29:44'),
(9, 'L\'évanescence nuptiale', '100x100 cm', 'Huile et pigments naturels', 920.00, 'AVAILABLE', 'levanescence_nuptiale.jpg', 'levanescence_nuptiale', '2026-10-12 14:29:44'),
(10, 'L\'éveil des songes délicats', '120x40 cm (Panoramique)', 'Huile sur toile', 650.00, 'AVAILABLE', 'leveil_des_songes_delicats.jpg', 'leveil_des_songes_delicats', '2026-10-12 14:29:44'),
(11, 'L\'éveil des teintes', '80x60 cm', 'Huile et peinture au couteau sur toile', 540.00, 'AVAILABLE', 'leveil_des_teintes.jpg', 'leveil_des_teintes', '2026-10-12 14:29:44'),
(12, 'Murmure du vent dans les herbes', '90x70 cm', 'Technique mixte et pastel', 590.00, 'AVAILABLE', 'murmure_du_vent_dans_les_herbes.jpg', 'murmure_du_vent_dans_les_herbes', '2026-10-12 14:29:44'),
(13, 'Nébula rosa', '60x60 cm', 'Huile et pigments sur canvas', 460.00, 'AVAILABLE', 'nebula_rosa.jpg', 'nebula_rosa', '2026-10-12 14:29:44'),
(14, 'Racines de soie', '100x70 cm', 'Huile et pigments naturels', 690.00, 'RESERVED', 'racines_de_soie.jpg', 'racines_de_soie', '2026-10-12 14:29:44'),
(15, 'Rêve de tulle et de pétales', '80x65 cm', 'Technique mixte sur toile', 570.00, 'AVAILABLE', 'reve_de_tulle_et_de_petales.jpg', 'reve_de_tulle_et_de_petales', '2026-10-12 14:29:44'),
(16, 'Sous les ramures de la nuit', '100x80 cm', 'Huile sur toile', 720.00, 'AVAILABLE', 'sous_les_ramures_de_la_nuit.jpg', 'sous_les_ramures_de_la_nuit', '2026-10-12 14:29:44'),
(17, 'Symphonie crépusculaire', '120x50 cm (Panoramique)', 'Huile et encre sur chassis', 780.00, 'AVAILABLE', 'symphonie_crepusculaire.jpg', 'symphonie_crepusculaire', '2026-10-12 14:29:44'),
(18, 'Triptyque floral', '120x100 cm (3 panneaux)', 'Technique mixte sur bois/toile', 1100.00, 'SOLD', 'triptyque_floral.jpg', 'triptyque_floral', '2026-10-12 14:29:44'),
(19, 'Voie lactée florale', '70x70 cm', 'Huile et dorures sur canvas', 510.00, 'AVAILABLE', 'voie_lactee_florale.jpg', 'voie_lactee_florale', '2026-10-12 14:29:44');

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `painting_id` int(11) NOT NULL,
  `client_name` varchar(100) NOT NULL,
  `client_email` varchar(100) NOT NULL,
  `client_phone` varchar(20) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` enum('PENDING','CONFIRMED','CANCELLED') DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `reservations`
--

INSERT INTO `reservations` (`id`, `painting_id`, `client_name`, `client_email`, `client_phone`, `message`, `status`, `created_at`) VALUES
(3, 18, 'Gaelle Mancuso', 'gaelle.devweb72@gmail.com', NULL, NULL, '', '2026-10-14 13:39:47'),
(4, 14, 'Gaelle Mancuso', 'gaelle.devweb72@gmail.com', NULL, NULL, '', '2026-10-14 14:40:57');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Gaelle Mancuso', 'gaelle.devweb72@gmail.com', '$2b$10$0JpkPmuL5dW4zTDvrXkTOOqtVzj/USDfcnmZzmF9ghDzKCVCzU1Om', 'user', '2026-10-12 13:37:21'),
(2, 'John Doe', 'john@xxx.com', '$2b$10$D507qzwdJIdIajwolG0tL..4XbmA4qeugUsRxoX/JYeMk4Knt1TR6', 'user', '2026-10-15 15:21:57');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `paintings`
--
ALTER TABLE `paintings`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `painting_id` (`painting_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `paintings`
--
ALTER TABLE `paintings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`painting_id`) REFERENCES `paintings` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
