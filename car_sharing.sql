-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Час створення: Бер 13 2026 р., 22:18
-- Версія сервера: 10.4.32-MariaDB
-- Версія PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База даних: `car_sharing`
--
CREATE DATABASE IF NOT EXISTS `car_sharing` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `car_sharing`;

-- --------------------------------------------------------

--
-- Структура таблиці `additional_services`
--

CREATE TABLE IF NOT EXISTS `additional_services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `icon` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `desc` text NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблиці `available_discounts`
--

CREATE TABLE IF NOT EXISTS `available_discounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `min_days` int(11) NOT NULL,
  `max_days` int(11) DEFAULT NULL,
  `discount_percent` decimal(5,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблиці `cars`
--

CREATE TABLE IF NOT EXISTS `cars` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `brand` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `year` smallint(6) NOT NULL,
  `license_plate` varchar(20) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `passengers` int(11) DEFAULT 5,
  `luggage` int(11) DEFAULT 2,
  `transmission` enum('automatic','mechanic') NOT NULL,
  `fuel_type` enum('gasoline','gas','electricity') NOT NULL,
  `features` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `images` text DEFAULT NULL,
  `price_per_day` decimal(10,2) NOT NULL,
  `status` enum('available','reserved','in_service','inactive') DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `license_plate` (`license_plate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблиці `deals`
--

CREATE TABLE IF NOT EXISTS `deals` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `car_id` bigint(20) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `pick_up_location` varchar(255) DEFAULT NULL,
  `additional_services` text DEFAULT NULL,
  `status` enum('pending','confirmed','active','completed','cancelled','disputed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_deal_user` (`user_id`),
  KEY `fk_deal_car` (`car_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблиці `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('client','admin') NOT NULL DEFAULT 'client',
  `phone` varchar(30) DEFAULT NULL,
  `drivers_license` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `card_number` varchar(50) DEFAULT NULL,
  `expires` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Обмеження зовнішнього ключа збережених таблиць
--

--
-- Обмеження зовнішнього ключа таблиці `deals`
--
ALTER TABLE `deals`
  ADD CONSTRAINT `fk_deal_car` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`),
  ADD CONSTRAINT `fk_deal_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
