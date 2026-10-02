/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.10-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: events
-- ------------------------------------------------------
-- Server version	10.11.10-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booked_events`
--

DROP TABLE IF EXISTS `booked_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `booked_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categories_id` int(11) DEFAULT NULL,
  `categories_name` varchar(255) DEFAULT NULL,
  `subCategories_id` int(11) DEFAULT NULL,
  `subCategories_name` varchar(255) DEFAULT NULL,
  `width` varchar(255) DEFAULT NULL,
  `height` varchar(255) DEFAULT NULL,
  `qt` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booked_events`
--

LOCK TABLES `booked_events` WRITE;
/*!40000 ALTER TABLE `booked_events` DISABLE KEYS */;
INSERT INTO `booked_events` VALUES
(1,1,'Truss',1,'500MM*600MM','20','30',0,4,'2026-05-07 08:22:28','2026-05-07 08:22:28'),
(2,2,'Chair',2,'Maraja Chair','0','0',40,4,'2026-05-07 08:22:28','2026-05-07 08:22:28'),
(3,3,'Carpet',3,'Red Carpet','10','50',0,4,'2026-05-07 08:22:28','2026-05-07 08:22:28'),
(4,1,'Truss',1,'500MM*600MM','10ft','10ft',0,5,'2026-05-07 10:20:26','2026-05-07 10:20:26'),
(5,3,'Carpet',3,'Red Carpet','5ft','30ft',0,5,'2026-05-07 10:20:26','2026-05-07 10:20:26'),
(6,2,'Chair',2,'Maraja Chair','0','0',50,5,'2026-05-07 10:20:26','2026-05-07 10:20:26'),
(7,1,'Truss',1,'500MM*600MM','90','90',0,6,'2026-05-07 14:29:40','2026-05-07 14:29:40');
/*!40000 ALTER TABLE `booked_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES
(1,'Truss','Tb-01 ','test','1','2026-05-06 17:04:31','2026-05-06 17:04:31'),
(2,'Chair','Ch-01','test','1','2026-05-06 18:07:08','2026-05-06 18:07:08'),
(3,'Carpet','carpt','test','1','2026-05-06 19:26:40','2026-05-06 19:26:40');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `designs`
--

DROP TABLE IF EXISTS `designs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `designs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `design_name` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `designs`
--

LOCK TABLES `designs` WRITE;
/*!40000 ALTER TABLE `designs` DISABLE KEYS */;
INSERT INTO `designs` VALUES
(3,'React ','2026-05-06 20:41:06','2026-05-06 20:41:06'),
(4,'BirthDay Party','2026-05-06 20:42:22','2026-05-06 20:42:22'),
(5,'Marrige Design Events','2026-05-07 07:16:49','2026-05-07 07:16:49'),
(6,'Box Truss 90*90*30','2026-05-07 14:29:40','2026-05-07 14:29:40');
/*!40000 ALTER TABLE `designs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `c_name` varchar(255) NOT NULL,
  `vanus` varchar(255) NOT NULL,
  `doe` datetime NOT NULL,
  `v_location` varchar(255) NOT NULL,
  `v_a_d` datetime NOT NULL,
  `nodb` int(11) NOT NULL,
  `pob` varchar(255) NOT NULL,
  `tc` varchar(255) NOT NULL,
  `sr` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `categories_id` int(11) NOT NULL,
  `sub_categories_id` int(11) NOT NULL,
  `quntites` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `status` enum('0','1','2','3','4') NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `design_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categories_id` (`categories_id`),
  KEY `sub_categories_id` (`sub_categories_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`sub_categories_id`) REFERENCES `subcategories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES
(4,'parakshtech','parakshtech','2026-05-07 00:00:00','parakshtech','2026-05-07 11:51:00',14,'parakshtech','50','test',50,3,3,NULL,NULL,NULL,'1','2026-05-07 08:22:28','2026-05-07 08:22:28',5),
(5,'Parakshtech','Birthday','2026-05-07 00:00:00','Buxar','2026-05-07 13:52:00',1,'Buxar','50','test',50,2,2,NULL,NULL,NULL,'1','2026-05-07 10:20:26','2026-05-07 10:55:12',4),
(6,'Test','dahod','2026-05-21 00:00:00','dahod ','2026-05-22 17:57:00',1,'gujrat','50000','',100000,1,1,NULL,NULL,NULL,'1','2026-05-07 14:29:40','2026-05-07 14:29:40',6);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invertories`
--

DROP TABLE IF EXISTS `invertories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invertories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `quality` varchar(255) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `ware_house_id` int(11) NOT NULL,
  `categories_id` int(11) NOT NULL,
  `sub_categories_id` int(11) NOT NULL,
  `is_enable` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ware_house_id` (`ware_house_id`),
  KEY `categories_id` (`categories_id`),
  KEY `sub_categories_id` (`sub_categories_id`),
  CONSTRAINT `invertories_ibfk_1` FOREIGN KEY (`ware_house_id`) REFERENCES `ware_houses` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `invertories_ibfk_2` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `invertories_ibfk_3` FOREIGN KEY (`sub_categories_id`) REFERENCES `subcategories` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invertories`
--

LOCK TABLES `invertories` WRITE;
/*!40000 ALTER TABLE `invertories` DISABLE KEYS */;
INSERT INTO `invertories` VALUES
(1,NULL,NULL,NULL,NULL,'Good',30,1,1,1,1,'2026-05-06 17:09:37','2026-05-06 17:09:37'),
(2,NULL,NULL,NULL,500,'Good ',300,1,2,2,0,'2026-05-06 18:08:01','2026-05-06 18:08:01'),
(3,NULL,NULL,NULL,NULL,NULL,20,1,3,3,1,'2026-05-06 19:28:18','2026-05-06 19:28:18');
/*!40000 ALTER TABLE `invertories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ft` varchar(255) DEFAULT NULL,
  `qt` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `stock_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` VALUES
(1,'5ft',50,NULL,NULL,1,'2026-05-06 17:09:37','2026-05-06 17:09:37'),
(2,'8ft',40,NULL,NULL,1,'2026-05-06 17:09:37','2026-05-06 17:09:37'),
(3,'10ft',30,NULL,NULL,1,'2026-05-06 17:09:37','2026-05-06 17:09:37'),
(4,'12ft',20,NULL,NULL,1,'2026-05-06 17:09:37','2026-05-06 17:09:37'),
(5,'15ft',10,NULL,NULL,1,'2026-05-06 17:09:37','2026-05-06 17:09:37'),
(6,'10ft',5,NULL,NULL,1,'2026-05-06 17:09:37','2026-05-06 17:09:37'),
(7,'30ft',40,NULL,NULL,3,'2026-05-06 19:28:18','2026-05-06 19:28:18');
/*!40000 ALTER TABLE `items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES
(1,'USERS','2026-04-09 08:40:01','2026-04-09 08:40:01'),
(2,'ADMIN','2026-04-09 08:40:16','2026-04-09 08:40:16'),
(3,'MANAGER','2026-04-09 08:40:22','2026-04-09 08:40:22');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategories`
--

DROP TABLE IF EXISTS `subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subcategories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `categories_id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `is_enable` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categories_id` (`categories_id`),
  CONSTRAINT `subcategories_ibfk_1` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategories`
--

LOCK TABLES `subcategories` WRITE;
/*!40000 ALTER TABLE `subcategories` DISABLE KEYS */;
INSERT INTO `subcategories` VALUES
(1,'500MM*600MM',1,'500MM*600MM','500MM*600MM','1','2026-05-06 17:04:58','2026-05-06 17:04:58',1),
(2,'Maraja Chair',2,'Maraja','test','1','2026-05-06 18:07:32','2026-05-06 18:07:32',NULL),
(3,'Red Carpet',3,'Rc','test','1','2026-05-06 19:27:15','2026-05-06 19:27:15',1),
(4,'100MM*400MM',1,'100MM*400MM','100MM*400MM','1','2026-05-08 16:40:57','2026-05-08 16:40:57',0);
/*!40000 ALTER TABLE `subcategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_assign_users`
--

DROP TABLE IF EXISTS `team_assign_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team_assign_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `team_assign_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `assignedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `team_assign_id` (`team_assign_id`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `team_assign_users_ibfk_1` FOREIGN KEY (`team_assign_id`) REFERENCES `team_assigns` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `team_assign_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `team_assign_users_ibfk_3` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_assign_users`
--

LOCK TABLES `team_assign_users` WRITE;
/*!40000 ALTER TABLE `team_assign_users` DISABLE KEYS */;
INSERT INTO `team_assign_users` VALUES
(1,1,1,5,'pending','2026-05-07 10:55:12'),
(2,1,2,5,'pending','2026-05-07 10:55:12');
/*!40000 ALTER TABLE `team_assign_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_assigns`
--

DROP TABLE IF EXISTS `team_assigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team_assigns` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `inventoryCategory` int(11) NOT NULL,
  `inventorySubcategories` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `stockLocation` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `inventoryCategory` (`inventoryCategory`),
  KEY `inventorySubcategories` (`inventorySubcategories`),
  KEY `event_id` (`event_id`),
  KEY `stockLocation` (`stockLocation`),
  CONSTRAINT `team_assigns_ibfk_1` FOREIGN KEY (`inventoryCategory`) REFERENCES `categories` (`id`),
  CONSTRAINT `team_assigns_ibfk_2` FOREIGN KEY (`inventorySubcategories`) REFERENCES `subcategories` (`id`),
  CONSTRAINT `team_assigns_ibfk_3` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `team_assigns_ibfk_4` FOREIGN KEY (`stockLocation`) REFERENCES `invertories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_assigns`
--

LOCK TABLES `team_assigns` WRITE;
/*!40000 ALTER TABLE `team_assigns` DISABLE KEYS */;
INSERT INTO `team_assigns` VALUES
(1,1,1,5,'2026-05-07','05:30:00',1,'2026-05-07 10:55:12','2026-05-07 10:55:12');
/*!40000 ALTER TABLE `team_assigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `contact2` varchar(255) DEFAULT NULL,
  `contact3` varchar(255) DEFAULT NULL,
  `job` datetime DEFAULT NULL,
  `dob` datetime DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT 'male',
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `sifting_type` int(11) DEFAULT NULL,
  `base_pay` int(11) DEFAULT NULL,
  `insurance` tinyint(1) DEFAULT NULL,
  `adharcard_front` varchar(255) DEFAULT NULL,
  `adharcard_back` varchar(255) DEFAULT NULL,
  `insurance_pic` varchar(255) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `role_id` int(11) NOT NULL DEFAULT 1,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `pincode` int(11) DEFAULT NULL,
  `v_code` int(11) DEFAULT NULL,
  `isvarified` tinyint(1) DEFAULT 0,
  `isactive` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contact` (`contact`),
  UNIQUE KEY `contact2` (`contact2`),
  UNIQUE KEY `contact3` (`contact3`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `contact_2` (`contact`),
  UNIQUE KEY `contact2_2` (`contact2`),
  UNIQUE KEY `contact3_2` (`contact3`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `contact_3` (`contact`),
  UNIQUE KEY `contact2_3` (`contact2`),
  UNIQUE KEY `contact3_3` (`contact3`),
  UNIQUE KEY `email_3` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'Paraksh Tech','09296454675',NULL,NULL,NULL,NULL,'male','parakshtech@gmail.com','$2b$10$Jvxy4WDJVQUwteUaWKj5p..mGj1x1XkJhULRfB4N0PUjfNUVULX1.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,0,0,'2026-05-06 17:03:46','2026-05-06 17:03:46'),
(2,'alok kumar','8409056853',NULL,NULL,NULL,NULL,'male','alokbxr5523@gmail.com','$2b$10$tk7/VJuy57d.0TvDBrEyheiq7F4w8j9zRuIHeDZ1.lRawNjWjde72',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,0,0,'2026-05-06 17:04:20','2026-05-06 17:04:20'),
(3,'Dushyant D','9893232724',NULL,NULL,NULL,NULL,'male','dushyantdeshmukh@gmail.com','$2b$10$X5Lt47ocAAyWiTHr/pZ0X.i8YmfI/r6o.h5NvwGJs00W7kobryHkC',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,0,0,'2026-05-07 14:23:55','2026-05-07 14:23:55');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_types`
--

DROP TABLE IF EXISTS `vehicle_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehicle_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `wheel` int(11) NOT NULL,
  `capacity` int(11) NOT NULL,
  `fuel_type` enum('diesel','petrol','cng','electric') NOT NULL DEFAULT 'diesel',
  `isActive` enum('0','1') NOT NULL DEFAULT '1',
  `description` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_types`
--

LOCK TABLES `vehicle_types` WRITE;
/*!40000 ALTER TABLE `vehicle_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicle_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `vehicle_number` varchar(255) NOT NULL,
  `vehicle_type_id` int(11) NOT NULL,
  `owner_agency` varchar(255) DEFAULT NULL,
  `contact` bigint(20) DEFAULT NULL,
  `driver_contact` bigint(20) DEFAULT NULL,
  `ownershiptype` varchar(255) DEFAULT NULL,
  `load_capacity` int(11) DEFAULT NULL,
  `commission` varchar(255) DEFAULT NULL,
  `insurance` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('0','1') DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vehicle_type_id` (`vehicle_type_id`),
  CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ware_houses`
--

DROP TABLE IF EXISTS `ware_houses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ware_houses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `capacity` varchar(255) DEFAULT NULL,
  `manager_name` varchar(255) DEFAULT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `gst_number` varchar(255) DEFAULT NULL,
  `license_number` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `google_link` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ware_houses`
--

LOCK TABLES `ware_houses` WRITE;
/*!40000 ALTER TABLE `ware_houses` DISABLE KEYS */;
INSERT INTO `ware_houses` VALUES
(1,'Pustakalay Road Buxar','AV-2552','Buxar ','1000','Manoj Sharma ','+919296454675','29AAAGM0289C1ZF','AV-2552','Sohani patti buxar ,Dist + Post : Buxar, ','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28791.961393570953!2d83.9570527165446!3d25.571827320140017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa3297e4511ac571d%3A0xd998d758e2327ad9!2sParaksh%20Tech%20Solution!5e0!3m2!1sen!2sin!4v1776251837088!5m2!1sen!2sin','2026-05-06 17:05:59','2026-05-06 17:05:59');
/*!40000 ALTER TABLE `ware_houses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'events'
--

--
-- Dumping routines for database 'events'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-10 21:20:00
