CREATE DATABASE  IF NOT EXISTS `movie_rental` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci */;
USE `movie_rental`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: movie_rental
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actor`
--

DROP TABLE IF EXISTS `actor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actor`
--

LOCK TABLES `actor` WRITE;
/*!40000 ALTER TABLE `actor` DISABLE KEYS */;
INSERT INTO `actor` VALUES (1,'Sam','Worthington'),(2,'Zoe','Saldana'),(3,'Sigourney','Weaver'),(4,'Tom','Cruise'),(5,'Miles','Teller'),(6,'Jennifer','Connelly'),(7,'Jon','Hamm'),(8,'Letitia','Wright'),(9,'Lupita','Nyongo'),(10,'Danai','Gurira'),(11,'Tim','Robbins'),(12,'Morgan','Freeman'),(13,'Bob\r\n\r\n','Gunton'),(14,'Chris','Pratt');
/*!40000 ALTER TABLE `actor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `director`
--

DROP TABLE IF EXISTS `director`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `director` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `bio` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `director`
--

LOCK TABLES `director` WRITE;
/*!40000 ALTER TABLE `director` DISABLE KEYS */;
INSERT INTO `director` VALUES (1,'Joseph','Kosinski','Joseph Kosinski nació el 3 de mayo de 1974 en Iowa, Estados Unidos.'),(2,'James','Cameron','James Cameron nació el 16 de agosto de 1954 en Ontario, Canadá.'),(3,'Ryan','Coogler','Ryan Coogler nació el 23 de mayo de 1986 en Oakland, California, Estados Unidos.'),(4,'Frank','Darabont','Frank Darabont nació el 28 de enero de 1959 en Francia.'),(5,'James','Gunn','James Gunn nació el 5 de agosto de 1966 en St. Louis, Missouri, Estados Unidos.');
/*!40000 ALTER TABLE `director` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genre`
--

DROP TABLE IF EXISTS `genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genre` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genre`
--

LOCK TABLES `genre` WRITE;
/*!40000 ALTER TABLE `genre` DISABLE KEYS */;
INSERT INTO `genre` VALUES (1,'Aventura'),(2,'Acción'),(3,'Ciencia Ficción'),(4,'Comedia'),(5,'Drama'),(6,'Fantasía'),(7,'Musical'),(8,'Terror');
/*!40000 ALTER TABLE `genre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `movie_id` int(11) NOT NULL,
  `shop_id` int(11) NOT NULL,
  `price` decimal(18,2) NOT NULL DEFAULT 1.00,
  PRIMARY KEY (`movie_id`,`shop_id`),
  KEY `inventory_shop_movie_idx` (`shop_id`),
  CONSTRAINT `inventory_movie` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `inventory_shop` FOREIGN KEY (`shop_id`) REFERENCES `shop_rental` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES (1,1,3000.00),(1,2,3000.00),(2,1,3500.00),(2,2,3500.00),(2,3,3500.00),(3,1,4000.00),(3,2,4000.00),(3,3,4500.00),(4,1,3000.00),(4,2,2800.00),(4,3,3000.00),(5,1,3000.00),(5,2,2800.00),(5,3,3000.00);
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie`
--

DROP TABLE IF EXISTS `movie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `year` smallint(4) unsigned NOT NULL,
  `time` tinyint(4) unsigned NOT NULL,
  `director_id` int(11) NOT NULL,
  `lang` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_movie_director_idx` (`director_id`),
  CONSTRAINT `fk_movie_director` FOREIGN KEY (`director_id`) REFERENCES `director` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie`
--

LOCK TABLES `movie` WRITE;
/*!40000 ALTER TABLE `movie` DISABLE KEYS */;
INSERT INTO `movie` VALUES (1,'Top Gun: Maverick',2022,130,1,'Inglés'),(2,'Avatar',2009,162,2,'Inglés'),(3,'Black Panther: Wakanda Forever',2022,161,3,'Inglés'),(4,'Cadena perpetua',1994,142,4,'Inglés'),(5,'Guardianes de la Galaxia',2014,121,5,'Inglés');
/*!40000 ALTER TABLE `movie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie_cast`
--

DROP TABLE IF EXISTS `movie_cast`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_cast` (
  `actor_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `role` varchar(100) NOT NULL,
  PRIMARY KEY (`actor_id`,`movie_id`),
  KEY `movie_id` (`movie_id`),
  CONSTRAINT `movie_cast_ibfk_1` FOREIGN KEY (`actor_id`) REFERENCES `actor` (`id`),
  CONSTRAINT `movie_cast_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_cast`
--

LOCK TABLES `movie_cast` WRITE;
/*!40000 ALTER TABLE `movie_cast` DISABLE KEYS */;
INSERT INTO `movie_cast` VALUES (1,2,'Jake Sully'),(2,2,'Neytiri Sully'),(2,5,'Gamora'),(3,2,'Doctora Grace Augustine'),(4,1,'Pete Mitchell'),(5,1,'Bradley Bradshaw'),(6,1,'Penny Benjamin'),(7,1,'Beau Simpson'),(8,3,'Shuri'),(9,3,'Nakia'),(10,3,'Okoye'),(11,4,'Andy Dufresne'),(12,4,'Ellis Boyd, Red'),(13,4,'Warden Notron'),(14,5,'Peter Quill');
/*!40000 ALTER TABLE `movie_cast` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie_genre`
--

DROP TABLE IF EXISTS `movie_genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_genre` (
  `movie_id` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL,
  PRIMARY KEY (`movie_id`,`genre_id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `movie_genre_ibfk_1` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`),
  CONSTRAINT `movie_genre_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_genre`
--

LOCK TABLES `movie_genre` WRITE;
/*!40000 ALTER TABLE `movie_genre` DISABLE KEYS */;
INSERT INTO `movie_genre` VALUES (1,2),(1,5),(2,1),(2,2),(2,3),(2,6),(3,1),(3,2),(3,5),(4,5),(5,1),(5,2),(5,4);
/*!40000 ALTER TABLE `movie_genre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movie_image`
--

DROP TABLE IF EXISTS `movie_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movie_image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `movie_id` int(11) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `movie_images_movie_idx` (`movie_id`),
  CONSTRAINT `movie_images_movie` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movie_image`
--

SELECT g.id, g.fname, g.lname, mg.role
            FROM actor g, movie_cast mg
            where g.id=mg.actor_id and mg.movie_id=1;

LOCK TABLES `movie_image` WRITE;
/*!40000 ALTER TABLE `movie_image` DISABLE KEYS */;
INSERT INTO `movie_image` VALUES (1,1,'movie-66db12b9cf65f.jpg','2024-09-06 14:33:29'),(2,2,'movie-66db13123b751.jpg','2024-09-06 14:34:58'),(3,4,'movie-66db27183be49.jpg','2024-09-06 16:00:24'),(4,5,'movie-66db27a040c85.jpg','2024-09-06 16:02:40'),(5,3,'movie-66db27cfac929.jpg','2024-09-06 16:03:27');
/*!40000 ALTER TABLE `movie_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rental`
--

DROP TABLE IF EXISTS `rental`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rental` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shop_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `rental_date` date NOT NULL,
  `total` decimal(18,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `rental_inventory_shop_idx` (`shop_id`),
  KEY `rental_user_idx` (`customer_id`),
  CONSTRAINT `rental_shop` FOREIGN KEY (`shop_id`) REFERENCES `shop_rental` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `rental_user` FOREIGN KEY (`customer_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rental`
--

LOCK TABLES `rental` WRITE;
/*!40000 ALTER TABLE `rental` DISABLE KEYS */;
INSERT INTO `rental` VALUES (1,1,2,'2024-10-02',76000.00),(2,1,3,'2024-10-03',3500.00),(3,2,4,'2024-10-03',11200.00),(4,3,5,'2024-10-04',3000.00),(5,1,3,'2024-10-13',10000.00);
/*!40000 ALTER TABLE `rental` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rental_movie`
--

DROP TABLE IF EXISTS `rental_movie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rental_movie` (
  `rental_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `price` decimal(18,2) NOT NULL,
  `days` tinyint(4) NOT NULL DEFAULT 1,
  `subtotal` decimal(18,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`rental_id`,`movie_id`),
  KEY `rental_movie_movie_idx` (`movie_id`),
  CONSTRAINT `rental_movie_movie` FOREIGN KEY (`movie_id`) REFERENCES `movie` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `rental_movie_rental` FOREIGN KEY (`rental_id`) REFERENCES `rental` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rental_movie`
--

LOCK TABLES `rental_movie` WRITE;
/*!40000 ALTER TABLE `rental_movie` DISABLE KEYS */;
INSERT INTO `rental_movie` VALUES (1,1,3000.00,2,6000.00),(1,2,3500.00,2,70000.00),(2,2,3500.00,1,3500.00),(3,4,2800.00,2,5600.00),(3,5,2800.00,2,5600.00),(4,5,3000.00,1,3000.00),(5,1,3000.00,1,3000.00),(5,3,4000.00,1,4000.00),(5,5,3000.00,1,3000.00);
/*!40000 ALTER TABLE `rental_movie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(65) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Administrador'),(2,'Cliente');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_rental`
--

DROP TABLE IF EXISTS `shop_rental`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_rental` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` text DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_rental`
--

LOCK TABLES `shop_rental` WRITE;
/*!40000 ALTER TABLE `shop_rental` DISABLE KEYS */;
INSERT INTO `shop_rental` VALUES (1,'Alajuela','Sucursal Alajuela, 100 m. este de la Catedral',1),(2,'Heredia','Sucursal Heredia, 200 m. sur de la UNA',1),(3,'San José','Sucursal San José, 150 m. este del parque de la Merce',1);
/*!40000 ALTER TABLE `shop_rental` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` text NOT NULL,
  `rol_id` int(11) NOT NULL DEFAULT 2,
  `shop_id` int(11) DEFAULT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `date_updated` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email` (`email`),
  KEY `fk_user_rol_idx` (`rol_id`),
  KEY `fk_user_shoprental_idx` (`shop_id`),
  CONSTRAINT `fk_user_rol` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_shoprental` FOREIGN KEY (`shop_id`) REFERENCES `shop_rental` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Administrador','admin@prueba.com','$2y$10$1ueeLDj8HL5ghcusBD/byOYhlcDBSiailMADfTkQ76dgU4IevRmNK',1,NULL,'2024-01-04 17:54:45','2024-01-04 17:54:45'),(2,'Karla Fonseca','cliente1@prueba.com','$2y$10$1ueeLDj8HL5ghcusBD/byOYhlcDBSiailMADfTkQ76dgU4IevRmNK',2,1,'2024-01-23 15:54:45','2024-01-23 15:54:45'),(3,'Pablo Ortiz','cliente2@prueba.com','$2y$10$1ueeLDj8HL5ghcusBD/byOYhlcDBSiailMADfTkQ76dgU4IevRmNK',2,1,'2024-01-23 15:54:45','2023-01-23 15:54:45'),(4,'Pamela Gómez','cliente3@prueba.com','$2y$10$1ueeLDj8HL5ghcusBD/byOYhlcDBSiailMADfTkQ76dgU4IevRmNK',2,2,'2024-01-23 15:54:45','2023-01-23 15:54:45'),(5,'Andrey Torres','cliente4@prueba.com','$2y$10$1ueeLDj8HL5ghcusBD/byOYhlcDBSiailMADfTkQ76dgU4IevRmNK',2,3,'2024-01-23 15:54:45','2023-01-23 15:54:45');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-06 10:18:59
