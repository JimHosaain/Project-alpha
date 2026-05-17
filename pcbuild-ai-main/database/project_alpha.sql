-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 16, 2026 at 07:44 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_alpha`
--

-- --------------------------------------------------------

--
-- Table structure for table `authentication`
--

CREATE TABLE `authentication` (
  `author_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `login_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `logout_time` datetime DEFAULT NULL,
  `status` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `authentication`
--

INSERT INTO `authentication` (`author_id`, `user_id`, `login_time`, `logout_time`, `status`) VALUES
(101, 1, '2026-05-01 02:00:00', '2026-05-01 10:00:00', 'offline'),
(102, 2, '2026-05-01 03:00:00', NULL, 'online'),
(103, 3, '2026-05-01 04:00:00', '2026-05-01 12:00:00', 'offline'),
(104, 4, '2026-05-01 05:00:00', NULL, 'online'),
(105, 5, '2026-05-01 06:00:00', '2026-05-01 01:00:00', 'offline'),
(106, 6, '2026-04-30 19:00:00', NULL, 'online'),
(107, 7, '2026-04-30 20:00:00', '2026-05-01 03:00:00', 'offline'),
(108, 8, '2026-04-30 21:00:00', NULL, 'online'),
(109, 9, '2026-04-30 22:00:00', '2026-05-01 05:00:00', 'offline'),
(110, 10, '2026-04-30 23:00:00', NULL, 'online');

-- --------------------------------------------------------

--
-- Table structure for table `budget`
--

CREATE TABLE `budget` (
  `budget_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `budget`
--

INSERT INTO `budget` (`budget_id`, `user_id`, `amount`) VALUES
(1, 1, 120000.00),
(2, 2, 50000.00),
(3, 3, 150000.00),
(4, 4, 80000.00),
(5, 5, 200000.00),
(6, 6, 95000.00),
(7, 7, 180000.00),
(8, 8, 220000.00),
(9, 9, 140000.00),
(10, 10, 60000.00);

-- --------------------------------------------------------

--
-- Table structure for table `build`
--

CREATE TABLE `build` (
  `build_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `fps` int(11) NOT NULL,
  `wattage` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `build`
--

INSERT INTO `build` (`build_id`, `user_id`, `total_price`, `fps`, `wattage`) VALUES
(1, 1, 180000.00, 180, 750),
(2, 2, 65000.00, 90, 550),
(3, 3, 220000.00, 240, 850),
(4, 4, 95000.00, 120, 650),
(5, 5, 250000.00, 300, 1000),
(6, 6, 120000.00, 144, 700),
(7, 7, 175000.00, 165, 750),
(8, 8, 280000.00, 320, 1050),
(9, 9, 145000.00, 140, 650),
(10, 10, 70000.00, 75, 500),
(11, 11, 160000.00, 170, 750),
(12, 12, 210000.00, 240, 850),
(13, 13, 130000.00, 130, 650),
(14, 14, 280000.00, 320, 1000),
(15, 15, 90000.00, 95, 550),
(16, 16, 175000.00, 180, 750),
(17, 17, 220000.00, 260, 900),
(18, 18, 145000.00, 140, 650),
(19, 19, 190000.00, 200, 800),
(20, 20, 110000.00, 120, 600);

-- --------------------------------------------------------

--
-- Table structure for table `buildcomponent`
--

CREATE TABLE `buildcomponent` (
  `build_id` int(11) NOT NULL,
  `component_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buildcomponent`
--

INSERT INTO `buildcomponent` (`build_id`, `component_id`) VALUES
(1, 1),
(1, 3),
(1, 5),
(1, 7),
(1, 9),
(2, 2),
(2, 4),
(2, 6),
(2, 8),
(2, 10);

-- --------------------------------------------------------

--
-- Table structure for table `chatbot`
--

CREATE TABLE `chatbot` (
  `chat_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `query` text NOT NULL,
  `response` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chatbot`
--

INSERT INTO `chatbot` (`chat_id`, `user_id`, `query`, `response`, `created_at`) VALUES
(1, 1, 'Best GPU for gaming?', 'RTX 4070 Super is recommended.', '2026-05-16 05:38:52'),
(2, 2, 'Best budget CPU?', 'Intel Core i5 is a good option.', '2026-05-16 05:38:52'),
(3, 3, 'Need editing build', 'Ryzen 7 build suggested.', '2026-05-16 05:38:52'),
(4, 4, 'Best RAM size?', '32GB DDR5 recommended.', '2026-05-16 05:38:52'),
(5, 5, 'Best PSU wattage?', '750W recommended.', '2026-05-16 05:38:52'),
(6, 6, 'Need storage advice', '1TB NVMe SSD suggested.', '2026-05-16 05:38:52'),
(7, 7, 'Best motherboard?', 'ASUS ROG B650 recommended.', '2026-05-16 05:38:52'),
(8, 8, 'Gaming monitor?', '144Hz monitor recommended.', '2026-05-16 05:38:52'),
(9, 9, 'Cooling suggestion?', 'Liquid cooling suggested.', '2026-05-16 05:38:52'),
(10, 10, 'Streaming build?', 'RTX + Ryzen combo recommended.', '2026-05-16 05:38:52');

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`comment_id`, `user_id`, `post_id`, `content`, `created_at`) VALUES
(1, 2, 1, 'RTX 4070 Super is excellent.', '2026-05-16 05:40:07'),
(2, 3, 2, 'Go with Ryzen build.', '2026-05-16 05:40:07'),
(3, 4, 3, 'RX cards offer better value.', '2026-05-16 05:40:07'),
(4, 5, 4, '32GB RAM is enough.', '2026-05-16 05:40:07'),
(5, 6, 5, 'Samsung 990 Pro recommended.', '2026-05-16 05:40:07'),
(6, 7, 6, 'Use better cooling.', '2026-05-16 05:40:07'),
(7, 8, 7, 'Lian Li fans look great.', '2026-05-16 05:40:07'),
(8, 9, 8, 'Desktop gives better performance.', '2026-05-16 05:40:07'),
(9, 10, 9, 'Use silent PSU and fans.', '2026-05-16 05:40:07'),
(10, 1, 10, 'Upgrade GPU first for gaming.', '2026-05-16 05:40:07');

-- --------------------------------------------------------

--
-- Table structure for table `comparison`
--

CREATE TABLE `comparison` (
  `comparison_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `componentA_id` int(11) NOT NULL,
  `componentB_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comparison`
--

INSERT INTO `comparison` (`comparison_id`, `user_id`, `componentA_id`, `componentB_id`) VALUES
(1, 1, 1, 2),
(2, 2, 9, 10),
(3, 3, 5, 6),
(4, 4, 3, 4),
(5, 5, 7, 8),
(6, 6, 1, 9),
(7, 7, 2, 10),
(8, 8, 3, 7),
(9, 9, 4, 8),
(10, 10, 5, 9);

-- --------------------------------------------------------

--
-- Table structure for table `component`
--

CREATE TABLE `component` (
  `component_id` int(11) NOT NULL,
  `component_name` varchar(30) DEFAULT NULL,
  `type` varchar(30) DEFAULT NULL CHECK (`type` in ('CPU (processing)','Motherboard (connection)','RAM (temporary memory)','Storage (HDD/SSD)','GPU (graphics)','PSU (power)','Case (body)','Input devices','Output devices'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `component`
--

INSERT INTO `component` (`component_id`, `component_name`, `type`) VALUES
(1, 'Intel Core i5 14600K', 'CPU (processing)'),
(2, 'AMD Ryzen 7 7800X3D', 'CPU (processing)'),
(3, 'ASUS ROG B650', 'Motherboard (connection)'),
(4, 'MSI Z790 Tomahawk', 'Motherboard (connection)'),
(5, 'Corsair 32GB DDR5', 'RAM (temporary memory)'),
(6, 'Kingston Fury 16GB', 'RAM (temporary memory)'),
(7, 'Samsung 990 Pro 1TB', 'Storage (HDD/SSD)'),
(8, 'WD Blue 2TB HDD', 'Storage (HDD/SSD)'),
(9, 'RTX 4070 Super', 'GPU (graphics)'),
(10, 'RX 7900 XT', 'GPU (graphics)'),
(11, 'RTX 5080', 'GPU (graphics)'),
(12, 'RTX 5090', 'GPU (graphics)'),
(13, 'Ryzen 9 9950X', 'CPU (processing)'),
(14, 'Intel Core Ultra 9', 'CPU (processing)'),
(15, 'Gigabyte X870', 'Motherboard (connection)'),
(16, 'ASRock B760', 'Motherboard (connection)'),
(17, 'G.Skill Trident Z 64GB', 'RAM (temporary memory)'),
(18, 'Crucial DDR5 32GB', 'RAM (temporary memory)'),
(19, 'Samsung 4TB SSD', 'Storage (HDD/SSD)'),
(20, 'Corsair RM1000x', 'PSU (power)');

-- --------------------------------------------------------

--
-- Table structure for table `input_purpose`
--

CREATE TABLE `input_purpose` (
  `input_pupose` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `purpose_type` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `input_purpose`
--

INSERT INTO `input_purpose` (`input_pupose`, `user_id`, `purpose_type`) VALUES
(1, 1, 'Gaming'),
(2, 2, 'Office Work'),
(3, 3, 'Video Editing'),
(4, 4, 'Programming'),
(5, 5, 'Streaming'),
(6, 6, 'Graphic Design'),
(7, 7, '3D Rendering'),
(8, 8, 'Machine Learning'),
(9, 9, 'Cyber Security'),
(10, 10, 'Daily Use');

-- --------------------------------------------------------

--
-- Table structure for table `pcnews`
--

CREATE TABLE `pcnews` (
  `news_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pcnews`
--

INSERT INTO `pcnews` (`news_id`, `title`, `content`, `created_at`, `updated_at`) VALUES
(1, 'NVIDIA Launches RTX 5090', 'New flagship GPU released.', '2026-05-16 05:40:07', '2026-05-16 05:40:07'),
(2, 'AMD Ryzen 9000 Series', 'AMD announces next gen CPUs.', '2026-05-16 05:40:07', '2026-05-16 05:40:07'),
(3, 'DDR6 RAM Coming Soon', 'Faster memory technology incoming.', '2026-05-16 05:40:07', '2026-05-16 05:40:07'),
(4, 'Intel New Architecture', 'Intel reveals future plans.', '2026-05-16 05:40:07', '2026-05-16 05:40:07'),
(5, 'Best Gaming Builds 2026', 'Top builds for gamers.', '2026-05-16 05:40:07', '2026-05-16 05:40:07'),
(6, 'AI PCs Trending', 'AI optimized PCs growing fast.', '2026-05-16 05:40:07', '2026-05-16 05:40:07'),
(7, 'Cheaper SSD Prices', 'SSD market prices dropping.', '2026-05-16 05:40:07', '2026-05-16 05:40:07'),
(8, 'New Liquid Coolers', 'Advanced cooling systems launched.', '2026-05-16 05:40:07', '2026-05-16 05:40:07'),
(9, 'Gaming Monitor Trends', 'OLED gaming monitors becoming popular.', '2026-05-16 05:40:07', '2026-05-16 05:40:07'),
(10, 'Windows Optimization Tips', 'Performance tuning guide.', '2026-05-16 05:40:07', '2026-05-16 05:40:07');

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`post_id`, `user_id`, `title`, `content`, `created_at`) VALUES
(1, 1, 'Best Gaming GPU', 'Which GPU is best for 1440p?', '2026-05-16 05:40:07'),
(2, 2, 'Budget PC Build', 'Need build under 60k.', '2026-05-16 05:40:07'),
(3, 3, 'RTX vs RX', 'Which one should I buy?', '2026-05-16 05:40:07'),
(4, 4, 'Need Editing Setup', 'Best PC for Adobe Premiere?', '2026-05-16 05:40:07'),
(5, 5, 'SSD Recommendation', 'Suggest fast SSD.', '2026-05-16 05:40:07'),
(6, 6, 'CPU Temperature Issue', 'CPU getting too hot.', '2026-05-16 05:40:07'),
(7, 7, 'Best RGB Fans', 'Need aesthetic fans.', '2026-05-16 05:40:07'),
(8, 8, 'Laptop vs Desktop', 'Which is better for gaming?', '2026-05-16 05:40:07'),
(9, 9, 'Need Silent Build', 'Suggest low-noise setup.', '2026-05-16 05:40:07'),
(10, 10, 'Upgrade Advice', 'Should I upgrade GPU first?', '2026-05-16 05:40:07'),
(11, 11, 'Need RTX Build', 'Suggest RTX 5080 build.', '2026-05-16 05:40:07'),
(12, 12, 'Best CPU Cooler', 'Which cooler is best?', '2026-05-16 05:40:07'),
(13, 13, 'Need Budget GPU', 'GPU under 30k?', '2026-05-16 05:40:07'),
(14, 14, '4K Gaming Setup', 'Need high-end gaming PC.', '2026-05-16 05:40:07'),
(15, 15, 'Best SSD Brand', 'Samsung or WD?', '2026-05-16 05:40:07'),
(16, 16, 'RGB Build Ideas', 'Need aesthetic setup.', '2026-05-16 05:40:07'),
(17, 17, 'High FPS Build', 'Need 240 FPS build.', '2026-05-16 05:40:07'),
(18, 18, 'PC Upgrade Help', 'Should I upgrade RAM?', '2026-05-16 05:40:07'),
(19, 19, 'Best PSU', 'Need reliable PSU.', '2026-05-16 05:40:07'),
(20, 20, 'Streaming PC Advice', 'Need dual PC setup.', '2026-05-16 05:40:07');

-- --------------------------------------------------------

--
-- Table structure for table `posttag`
--

CREATE TABLE `posttag` (
  `post_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posttag`
--

INSERT INTO `posttag` (`post_id`, `tag_id`, `created_at`) VALUES
(1, 1, '2026-05-16 05:40:07'),
(2, 2, '2026-05-16 05:40:07'),
(3, 3, '2026-05-16 05:40:07'),
(4, 4, '2026-05-16 05:40:07'),
(5, 7, '2026-05-16 05:40:07'),
(6, 8, '2026-05-16 05:40:07'),
(7, 9, '2026-05-16 05:40:07'),
(8, 1, '2026-05-16 05:40:07'),
(9, 8, '2026-05-16 05:40:07'),
(10, 10, '2026-05-16 05:40:07');

-- --------------------------------------------------------

--
-- Table structure for table `pricetracking`
--

CREATE TABLE `pricetracking` (
  `track_id` int(11) NOT NULL,
  `component_id` int(11) NOT NULL,
  `old_price` decimal(10,2) NOT NULL,
  `new_price` decimal(10,2) NOT NULL,
  `changed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pricetracking`
--

INSERT INTO `pricetracking` (`track_id`, `component_id`, `old_price`, `new_price`, `changed_at`) VALUES
(1, 1, 37000.00, 35000.00, '2026-05-16 05:38:20'),
(2, 2, 50000.00, 48000.00, '2026-05-16 05:38:20'),
(3, 3, 27000.00, 25000.00, '2026-05-16 05:38:20'),
(4, 4, 32000.00, 30000.00, '2026-05-16 05:38:20'),
(5, 5, 17000.00, 15000.00, '2026-05-16 05:38:20'),
(6, 6, 10000.00, 9000.00, '2026-05-16 05:38:20'),
(7, 7, 20000.00, 18000.00, '2026-05-16 05:38:20'),
(8, 8, 8000.00, 7000.00, '2026-05-16 05:38:20'),
(9, 9, 90000.00, 85000.00, '2026-05-16 05:38:20'),
(10, 10, 100000.00, 95000.00, '2026-05-16 05:38:20');

-- --------------------------------------------------------

--
-- Table structure for table `recommendation`
--

CREATE TABLE `recommendation` (
  `rec_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `component_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recommendation`
--

INSERT INTO `recommendation` (`rec_id`, `user_id`, `component_id`) VALUES
(1, 1, 9),
(2, 2, 1),
(3, 3, 5),
(4, 4, 3),
(5, 5, 10),
(6, 6, 7),
(7, 7, 2),
(8, 8, 4),
(9, 9, 6),
(10, 10, 8);

-- --------------------------------------------------------

--
-- Table structure for table `store`
--

CREATE TABLE `store` (
  `store_id` int(11) NOT NULL,
  `store_name` varchar(100) NOT NULL,
  `store_location` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `store`
--

INSERT INTO `store` (`store_id`, `store_name`, `store_location`, `created_at`) VALUES
(1, 'Star Tech', 'Dhaka', '2026-05-16 05:37:54'),
(2, 'Ryans Computers', 'Dhaka', '2026-05-16 05:37:54'),
(3, 'TechLand', 'Dhaka', '2026-05-16 05:37:54'),
(4, 'Binary Logic', 'Chattogram', '2026-05-16 05:37:54'),
(5, 'PC House', 'Khulna', '2026-05-16 05:37:54'),
(6, 'Ultra Tech', 'Sylhet', '2026-05-16 05:37:54'),
(7, 'Game Hub', 'Rajshahi', '2026-05-16 05:37:54'),
(8, 'Build Zone', 'Dhaka', '2026-05-16 05:37:54'),
(9, 'Tech Valley', 'Barisal', '2026-05-16 05:37:54'),
(10, 'Computer Mania', 'Cumilla', '2026-05-16 05:37:54');

-- --------------------------------------------------------

--
-- Table structure for table `storeavailability`
--

CREATE TABLE `storeavailability` (
  `availability_id` int(11) NOT NULL,
  `store_id` int(11) NOT NULL,
  `component_id` int(11) NOT NULL,
  `stock_status` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `storeavailability`
--

INSERT INTO `storeavailability` (`availability_id`, `store_id`, `component_id`, `stock_status`, `price`) VALUES
(1, 1, 1, 'In Stock', 35000.00),
(2, 2, 2, 'Limited', 48000.00),
(3, 3, 3, 'In Stock', 25000.00),
(4, 4, 4, 'Out of Stock', 30000.00),
(5, 5, 5, 'In Stock', 15000.00),
(6, 6, 6, 'Limited', 9000.00),
(7, 7, 7, 'In Stock', 18000.00),
(8, 8, 8, 'In Stock', 7000.00),
(9, 9, 9, 'Limited', 85000.00),
(10, 10, 10, 'In Stock', 95000.00);

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

CREATE TABLE `tag` (
  `tag_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tag`
--

INSERT INTO `tag` (`tag_id`, `name`) VALUES
(2, 'Budget'),
(8, 'Cooling'),
(4, 'CPU'),
(1, 'Gaming'),
(3, 'GPU'),
(5, 'Motherboard'),
(6, 'RAM'),
(9, 'RGB'),
(7, 'Storage'),
(10, 'Upgrade');

-- --------------------------------------------------------

--
-- Table structure for table `upgradesuggestion`
--

CREATE TABLE `upgradesuggestion` (
  `upgrade_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `build_id` int(11) NOT NULL,
  `component_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `upgradesuggestion`
--

INSERT INTO `upgradesuggestion` (`upgrade_id`, `user_id`, `build_id`, `component_id`, `created_at`) VALUES
(1, 1, 1, 2, '2026-05-16 05:38:52'),
(2, 2, 2, 9, '2026-05-16 05:38:52'),
(3, 3, 3, 10, '2026-05-16 05:38:52'),
(4, 4, 4, 5, '2026-05-16 05:38:52'),
(5, 5, 5, 1, '2026-05-16 05:38:52'),
(6, 6, 6, 7, '2026-05-16 05:38:52'),
(7, 7, 7, 8, '2026-05-16 05:38:52'),
(8, 8, 8, 4, '2026-05-16 05:38:52'),
(9, 9, 9, 3, '2026-05-16 05:38:52'),
(10, 10, 10, 6, '2026-05-16 05:38:52');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(30) NOT NULL,
  `email` varchar(100) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `preferences` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `user_name`, `email`, `user_password`, `preferences`) VALUES
(1, 'Shadman Ahammad', 'shadman1@pcbuild.com', 'pass1234', 'Gaming PC'),
(2, 'Rahim Uddin', 'rahim2@pcbuild.com', 'pass1234', 'Budget Build'),
(3, 'Karim Hasan', 'karim3@pcbuild.com', 'pass1234', 'RGB Setup'),
(4, 'Nusrat Jahan', 'nusrat4@pcbuild.com', 'pass1234', 'Streaming PC'),
(5, 'Tanvir Ahmed', 'tanvir5@pcbuild.com', 'pass1234', 'High-End Gaming'),
(6, 'Faria Islam', 'faria6@pcbuild.com', 'pass1234', 'White Theme Build'),
(7, 'Sabbir Hossain', 'sabbir7@pcbuild.com', 'pass1234', 'Intel Build'),
(8, 'Mehedi Hasan', 'mehedi8@pcbuild.com', 'pass1234', 'AMD Ryzen Build'),
(9, 'Tanjila Akter', 'tanjila9@pcbuild.com', 'pass1234', 'Mini ITX Setup'),
(10, 'Arifur Rahman', 'arif10@pcbuild.com', 'pass1234', 'Workstation PC'),
(11, 'Arian Khan', 'arian11@pcbuild.com', 'pass1234', 'Gaming'),
(12, 'Sakib Ahmed', 'sakib12@pcbuild.com', 'pass1234', 'Streaming'),
(13, 'Nabil Hossain', 'nabil13@pcbuild.com', 'pass1234', 'Editing'),
(14, 'Jubayer Islam', 'jubayer14@pcbuild.com', 'pass1234', 'Programming'),
(15, 'Towsif Rahman', 'towsif15@pcbuild.com', 'pass1234', 'Office Build'),
(16, 'Fahim Hasan', 'fahim16@pcbuild.com', 'pass1234', 'RGB Setup'),
(17, 'Imran Chowdhury', 'imran17@pcbuild.com', 'pass1234', 'Gaming'),
(18, 'Rifat Karim', 'rifat18@pcbuild.com', 'pass1234', 'Budget Build'),
(19, 'Nahid Hasan', 'nahid19@pcbuild.com', 'pass1234', 'Streaming'),
(20, 'Mahin Ahmed', 'mahin20@pcbuild.com', 'pass1234', 'Editing'),
(21, 'Sarah Johnson', 'sarah21@pcbuild.com', 'pass1234', 'Gaming'),
(22, 'Michael Lee', 'michael22@pcbuild.com', 'pass1234', 'Workstation'),
(23, 'Emily Clark', 'emily23@pcbuild.com', 'pass1234', 'White Build'),
(24, 'Daniel Smith', 'daniel24@pcbuild.com', 'pass1234', 'AI PC'),
(25, 'Sophia Brown', 'sophia25@pcbuild.com', 'pass1234', 'Programming'),
(26, 'Ethan Walker', 'ethan26@pcbuild.com', 'pass1234', 'Office Setup'),
(27, 'Olivia White', 'olivia27@pcbuild.com', 'pass1234', 'Content Creation'),
(28, 'Noah Harris', 'noah28@pcbuild.com', 'pass1234', 'Gaming'),
(29, 'Mason Scott', 'mason29@pcbuild.com', 'pass1234', 'Streaming'),
(30, 'Ava Green', 'ava30@pcbuild.com', 'pass1234', 'Editing');

-- --------------------------------------------------------

--
-- Table structure for table `vote`
--

CREATE TABLE `vote` (
  `vote_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) DEFAULT NULL,
  `comment_id` int(11) DEFAULT NULL,
  `vote_type` enum('upvote','downvote') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ;

--
-- Dumping data for table `vote`
--

INSERT INTO `vote` (`vote_id`, `user_id`, `post_id`, `comment_id`, `vote_type`, `created_at`) VALUES
(1, 1, 1, NULL, 'upvote', '2026-05-16 05:40:07'),
(2, 2, 2, NULL, 'upvote', '2026-05-16 05:40:07'),
(3, 3, 3, NULL, 'downvote', '2026-05-16 05:40:07'),
(4, 4, 4, NULL, 'upvote', '2026-05-16 05:40:07'),
(5, 5, 5, NULL, 'upvote', '2026-05-16 05:40:07'),
(6, 6, NULL, 1, 'upvote', '2026-05-16 05:40:07'),
(7, 7, NULL, 2, 'upvote', '2026-05-16 05:40:07'),
(8, 8, NULL, 3, 'downvote', '2026-05-16 05:40:07'),
(9, 9, NULL, 4, 'upvote', '2026-05-16 05:40:07'),
(10, 10, NULL, 5, 'upvote', '2026-05-16 05:40:07');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `authentication`
--
ALTER TABLE `authentication`
  ADD PRIMARY KEY (`author_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `budget`
--
ALTER TABLE `budget`
  ADD PRIMARY KEY (`budget_id`),
  ADD KEY `fk_user_id_budget` (`user_id`);

--
-- Indexes for table `build`
--
ALTER TABLE `build`
  ADD PRIMARY KEY (`build_id`),
  ADD KEY `fk_user_id_build` (`user_id`);

--
-- Indexes for table `buildcomponent`
--
ALTER TABLE `buildcomponent`
  ADD PRIMARY KEY (`build_id`,`component_id`),
  ADD KEY `fk_component_id_buildComponent` (`component_id`);

--
-- Indexes for table `chatbot`
--
ALTER TABLE `chatbot`
  ADD PRIMARY KEY (`chat_id`),
  ADD KEY `fk_user_id_chatbot` (`user_id`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `fk_user_id_comment` (`user_id`),
  ADD KEY `fk_post_id_comment` (`post_id`);

--
-- Indexes for table `comparison`
--
ALTER TABLE `comparison`
  ADD PRIMARY KEY (`comparison_id`),
  ADD KEY `fk_user_id_comparison` (`user_id`),
  ADD KEY `fk_componentA_comparison` (`componentA_id`),
  ADD KEY `fk_componentB_comparison` (`componentB_id`);

--
-- Indexes for table `component`
--
ALTER TABLE `component`
  ADD PRIMARY KEY (`component_id`);

--
-- Indexes for table `input_purpose`
--
ALTER TABLE `input_purpose`
  ADD PRIMARY KEY (`input_pupose`),
  ADD KEY `fk_user_id_input_purpose` (`user_id`);

--
-- Indexes for table `pcnews`
--
ALTER TABLE `pcnews`
  ADD PRIMARY KEY (`news_id`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `fk_user_id_post` (`user_id`);

--
-- Indexes for table `posttag`
--
ALTER TABLE `posttag`
  ADD PRIMARY KEY (`post_id`,`tag_id`),
  ADD KEY `fk_tag_id_postTag` (`tag_id`);

--
-- Indexes for table `pricetracking`
--
ALTER TABLE `pricetracking`
  ADD PRIMARY KEY (`track_id`),
  ADD KEY `fk_component_id_priceTracking` (`component_id`);

--
-- Indexes for table `recommendation`
--
ALTER TABLE `recommendation`
  ADD PRIMARY KEY (`rec_id`),
  ADD KEY `fk_user_id_recommendation` (`user_id`),
  ADD KEY `fk_component_id_recommendation` (`component_id`);

--
-- Indexes for table `store`
--
ALTER TABLE `store`
  ADD PRIMARY KEY (`store_id`),
  ADD UNIQUE KEY `store_name` (`store_name`);

--
-- Indexes for table `storeavailability`
--
ALTER TABLE `storeavailability`
  ADD PRIMARY KEY (`availability_id`),
  ADD KEY `fk_store_id_storeAvailability` (`store_id`),
  ADD KEY `fk_component_id_storeAvailability` (`component_id`);

--
-- Indexes for table `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`tag_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `upgradesuggestion`
--
ALTER TABLE `upgradesuggestion`
  ADD PRIMARY KEY (`upgrade_id`),
  ADD KEY `fk_user_id_upgradeSuggestion` (`user_id`),
  ADD KEY `fk_build_id_upgradeSuggestion` (`build_id`),
  ADD KEY `fk_component_id_upgradeSuggestion` (`component_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `vote`
--
ALTER TABLE `vote`
  ADD PRIMARY KEY (`vote_id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`post_id`,`comment_id`),
  ADD KEY `fk_post_id_vote` (`post_id`),
  ADD KEY `fk_comment_id_vote` (`comment_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `authentication`
--
ALTER TABLE `authentication`
  MODIFY `author_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT for table `budget`
--
ALTER TABLE `budget`
  MODIFY `budget_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `build`
--
ALTER TABLE `build`
  MODIFY `build_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `chatbot`
--
ALTER TABLE `chatbot`
  MODIFY `chat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `comparison`
--
ALTER TABLE `comparison`
  MODIFY `comparison_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `component`
--
ALTER TABLE `component`
  MODIFY `component_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `input_purpose`
--
ALTER TABLE `input_purpose`
  MODIFY `input_pupose` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `pcnews`
--
ALTER TABLE `pcnews`
  MODIFY `news_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `pricetracking`
--
ALTER TABLE `pricetracking`
  MODIFY `track_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `recommendation`
--
ALTER TABLE `recommendation`
  MODIFY `rec_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `store`
--
ALTER TABLE `store`
  MODIFY `store_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `storeavailability`
--
ALTER TABLE `storeavailability`
  MODIFY `availability_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tag`
--
ALTER TABLE `tag`
  MODIFY `tag_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `upgradesuggestion`
--
ALTER TABLE `upgradesuggestion`
  MODIFY `upgrade_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `vote`
--
ALTER TABLE `vote`
  MODIFY `vote_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `authentication`
--
ALTER TABLE `authentication`
  ADD CONSTRAINT `authentication_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `budget`
--
ALTER TABLE `budget`
  ADD CONSTRAINT `fk_user_id_budget` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `build`
--
ALTER TABLE `build`
  ADD CONSTRAINT `fk_user_id_build` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `buildcomponent`
--
ALTER TABLE `buildcomponent`
  ADD CONSTRAINT `fk_build_id_buildComponent` FOREIGN KEY (`build_id`) REFERENCES `build` (`build_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_component_id_buildComponent` FOREIGN KEY (`component_id`) REFERENCES `component` (`component_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `chatbot`
--
ALTER TABLE `chatbot`
  ADD CONSTRAINT `fk_user_id_chatbot` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `fk_post_id_comment` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_id_comment` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `comparison`
--
ALTER TABLE `comparison`
  ADD CONSTRAINT `fk_componentA_comparison` FOREIGN KEY (`componentA_id`) REFERENCES `component` (`component_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_componentB_comparison` FOREIGN KEY (`componentB_id`) REFERENCES `component` (`component_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_id_comparison` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `input_purpose`
--
ALTER TABLE `input_purpose`
  ADD CONSTRAINT `fk_user_id_input_purpose` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `fk_user_id_post` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `posttag`
--
ALTER TABLE `posttag`
  ADD CONSTRAINT `fk_post_id_postTag` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tag_id_postTag` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`tag_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pricetracking`
--
ALTER TABLE `pricetracking`
  ADD CONSTRAINT `fk_component_id_priceTracking` FOREIGN KEY (`component_id`) REFERENCES `component` (`component_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `recommendation`
--
ALTER TABLE `recommendation`
  ADD CONSTRAINT `fk_component_id_recommendation` FOREIGN KEY (`component_id`) REFERENCES `component` (`component_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_id_recommendation` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `storeavailability`
--
ALTER TABLE `storeavailability`
  ADD CONSTRAINT `fk_component_id_storeAvailability` FOREIGN KEY (`component_id`) REFERENCES `component` (`component_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_store_id_storeAvailability` FOREIGN KEY (`store_id`) REFERENCES `store` (`store_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `upgradesuggestion`
--
ALTER TABLE `upgradesuggestion`
  ADD CONSTRAINT `fk_build_id_upgradeSuggestion` FOREIGN KEY (`build_id`) REFERENCES `build` (`build_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_component_id_upgradeSuggestion` FOREIGN KEY (`component_id`) REFERENCES `component` (`component_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_id_upgradeSuggestion` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `vote`
--
ALTER TABLE `vote`
  ADD CONSTRAINT `fk_comment_id_vote` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`comment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_post_id_vote` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_id_vote` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;