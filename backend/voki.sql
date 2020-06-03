-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 02. Jun 2020 um 12:57
-- Server-Version: 10.1.32-MariaDB
-- PHP-Version: 7.2.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `voki`
--
CREATE DATABASE IF NOT EXISTS `voki` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `voki`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `begriffe`
--

DROP TABLE IF EXISTS `begriffe`;
CREATE TABLE `begriffe` (
  `id` int(11) NOT NULL,
  `begriff` varchar(100) DEFAULT NULL,
  `beschreibung` varchar(5000) DEFAULT NULL,
  `link` varchar(1000) DEFAULT NULL,
  `wortlisteId` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `log`
--

DROP TABLE IF EXISTS `log`;
CREATE TABLE `log` (
  `id` int(11) NOT NULL,
  `ip` varchar(100) NOT NULL,
  `time` datetime NOT NULL,
  `information` varchar(4000) NOT NULL,
  `success` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
-- Tabellenstruktur für Tabelle `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `publickey` varchar(200) NOT NULL,
  `mail` varchar(2000) NOT NULL,
  `nachname` varchar(200) NOT NULL,
  `vorname` varchar(200) NOT NULL,
  `passwort` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `userwortlisten`
--

DROP TABLE IF EXISTS `userwortlisten`;
CREATE TABLE `userwortlisten` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `wortlisteId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `wortlisten`
--

DROP TABLE IF EXISTS `wortlisten`;
CREATE TABLE `wortlisten` (
  `id` int(11) NOT NULL,
  `name` varchar(1000) NOT NULL,
  `beschreibung` varchar(2000) DEFAULT NULL,
  `ownerId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `begriffe`
--
ALTER TABLE `begriffe`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `log`
--
ALTER TABLE `log`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `userwortlisten`
--
ALTER TABLE `userwortlisten`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `wortlisten`
--
ALTER TABLE `wortlisten`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `begriffe`
--
ALTER TABLE `begriffe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT für Tabelle `log`
--
ALTER TABLE `log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1186;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `userwortlisten`
--
ALTER TABLE `userwortlisten`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `wortlisten`
--
ALTER TABLE `wortlisten`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
