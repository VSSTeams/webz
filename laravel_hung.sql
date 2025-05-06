-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 20, 2025 at 12:39 PM
-- Server version: 8.2.0
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `laravel_hung`
--

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
CREATE TABLE IF NOT EXISTS `carts` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `carts_user_id_foreign` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `created_at`, `updated_at`) VALUES
(38, 1, '2025-04-15 02:17:28', '2025-04-15 02:17:28');

-- --------------------------------------------------------

--
-- Table structure for table `carts_detail`
--

DROP TABLE IF EXISTS `carts_detail`;
CREATE TABLE IF NOT EXISTS `carts_detail` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `cart_id` int UNSIGNED NOT NULL,
  `product_id` int UNSIGNED NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `carts_detail_cart_id_foreign` (`cart_id`),
  KEY `carts_detail_product_id_foreign` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Thời trang', '2025-03-29 06:09:55', '2025-03-29 06:09:55'),
(2, 'Chuồng - Lồng', '2025-03-31 05:40:30', '2025-03-31 05:40:30'),
(3, 'Thức ăn', '2025-04-01 22:50:20', '2025-04-01 22:50:20'),
(4, 'Phụ kiện', '2025-04-08 06:58:21', '2025-04-08 06:58:21'),
(5, 'Vệ sinh', '2025-04-08 07:06:06', '2025-04-08 07:06:06');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2025_03_14_055305_create_categories_table', 1),
(3, '2025_03_12_073549_create_products_table', 2),
(6, '2025_04_03_125346_create_carts_table', 3),
(12, '2025_04_03_140649_create_carts_detail_table', 4),
(20, '2025_04_08_070358_create_order_details_table', 6),
(19, '2025_04_08_070348_create_orders_table', 5),
(21, '2025_04_10_091958_add_google_id_to_users_table', 7);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_user_id_foreign` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `email`, `name`, `phone`, `address`, `payment_method`, `status`, `created_at`, `updated_at`) VALUES
(42, 3, 'thonghoang550@gmail.com', 'Thong Hoang', '0767278720', '7160 Ho Chi Minh City Pl', 'MoMo', 1, '2025-04-11 08:02:55', '2025-04-11 08:03:15'),
(43, 3, 'thonghoang550@gmail.com', 'Thong Hoang', '0767278720', '7160 Ho Chi Minh City Pl', 'COD', 0, '2025-04-12 05:49:25', '2025-04-12 05:49:25'),
(44, 3, 'thonghoang550@gmail.com', 'Thong Hoang', '0767278720', '7160 Ho Chi Minh City Pl', 'MoMo', 1, '2025-04-12 05:49:53', '2025-04-12 05:50:29'),
(45, 3, 'thonghoang550@gmail.com', 'Thong Hoang', '0767278720', '7160 Ho Chi Minh City Pl', 'COD', 0, '2025-04-12 05:51:03', '2025-04-12 05:51:03'),
(46, 3, 'thonghoang550@gmail.com', 'Thong Hoang', '0767278720', '7160 Ho Chi Minh City Pl', 'COD', 0, '2025-04-12 05:51:57', '2025-04-12 05:51:57'),
(47, 3, 'thonghoang550@gmail.com', 'Thong Hoang', '0767278720', '7160 Ho Chi Minh City Pl', 'MoMo', 1, '2025-04-12 05:54:03', '2025-04-12 05:54:30'),
(48, 3, 'thonghoang550@gmail.com', 'Thong Hoang', '0767278720', '7160 Ho Chi Minh City Pl', 'MoMo', 0, '2025-04-12 05:55:31', '2025-04-12 05:55:31'),
(49, 3, 'thonghoang550@gmail.com', 'Thong Hoang', '0767278720', '7160 Ho Chi Minh City Pl', 'MoMo', 1, '2025-04-12 05:59:33', '2025-04-12 06:00:04'),
(50, 3, 'thonghoang550@gmail.com', 'Thong Hoang', '0767278720', '7160 Ho Chi Minh City Pl', 'COD', 0, '2025-04-12 06:00:21', '2025-04-12 06:00:21'),
(51, 1, 'thonghoang550@gmail.com', 'Thong Hoang', '0767278720', '7160 Ho Chi Minh City Pl', 'COD', 0, '2025-04-15 02:05:00', '2025-04-15 02:05:00'),
(52, 3, 'thonghoang550@gmail.com', 'Thong Hoang', '0767278720', '7160 Ho Chi Minh City Pl', 'COD', 0, '2025-04-15 02:24:53', '2025-04-15 02:24:53'),
(53, 3, 'thonghoang550@gmail.com', 'Thong Hoang', '0767278720', '7160 Ho Chi Minh City Pl', 'MoMo', 1, '2025-04-15 07:04:59', '2025-04-15 07:05:24'),
(54, 3, 'thonghoang550@gmail.com', 'Thong Hoang', '0767278720', '7160 Ho Chi Minh City Pl', 'COD', 0, '2025-04-20 05:36:13', '2025-04-20 05:36:13');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
CREATE TABLE IF NOT EXISTS `order_details` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` int UNSIGNED NOT NULL,
  `product_id` int UNSIGNED NOT NULL,
  `quantity` int NOT NULL,
  `price` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_details_order_id_foreign` (`order_id`),
  KEY `order_details_product_id_foreign` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `quantity`, `price`, `created_at`, `updated_at`) VALUES
(42, 42, 9, 1, 200000, '2025-04-11 08:02:55', '2025-04-11 08:02:55'),
(43, 43, 2, 1, 150000, '2025-04-12 05:49:25', '2025-04-12 05:49:25'),
(44, 44, 13, 1, 1000, '2025-04-12 05:49:53', '2025-04-12 05:49:53'),
(45, 45, 9, 1, 200000, '2025-04-12 05:51:03', '2025-04-12 05:51:03'),
(46, 46, 9, 1, 200000, '2025-04-12 05:51:57', '2025-04-12 05:51:57'),
(47, 47, 13, 1, 1000, '2025-04-12 05:54:03', '2025-04-12 05:54:03'),
(48, 48, 13, 1, 1000, '2025-04-12 05:55:31', '2025-04-12 05:55:31'),
(49, 49, 13, 1, 1000, '2025-04-12 05:59:33', '2025-04-12 05:59:33'),
(50, 50, 1, 1, 89000, '2025-04-12 06:00:21', '2025-04-12 06:00:21'),
(51, 51, 2, 2, 300000, '2025-04-15 02:05:00', '2025-04-15 02:05:00'),
(52, 52, 2, 2, 300000, '2025-04-15 02:24:53', '2025-04-15 02:24:53'),
(53, 52, 1, 1, 89000, '2025-04-15 02:24:53', '2025-04-15 02:24:53'),
(54, 53, 1, 1, 89000, '2025-04-15 07:04:59', '2025-04-15 07:04:59'),
(55, 54, 3, 2, 500000, '2025-04-20 05:36:13', '2025-04-20 05:36:13'),
(56, 54, 12, 1, 220000, '2025-04-20 05:36:13', '2025-04-20 05:36:13'),
(57, 54, 2, 1, 150000, '2025-04-20 05:36:13', '2025-04-20 05:36:13'),
(58, 54, 1, 1, 89000, '2025-04-20 05:36:13', '2025-04-20 05:36:13'),
(59, 54, 8, 1, 500000, '2025-04-20 05:36:13', '2025-04-20 05:36:13'),
(60, 54, 7, 1, 500000, '2025-04-20 05:36:13', '2025-04-20 05:36:13'),
(61, 54, 6, 1, 250000, '2025-04-20 05:36:13', '2025-04-20 05:36:13'),
(62, 54, 11, 1, 245000, '2025-04-20 05:36:13', '2025-04-20 05:36:13'),
(63, 54, 10, 1, 230000, '2025-04-20 05:36:13', '2025-04-20 05:36:13'),
(64, 54, 13, 1, 1000, '2025-04-20 05:36:13', '2025-04-20 05:36:13');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth_token', '294e7c5915a19b17d8e99518eee693ccd183555b52b6a07f1143ffcb5b39c147', '[\"*\"]', '2025-04-08 01:17:51', NULL, '2025-04-08 00:54:51', '2025-04-08 01:17:51'),
(2, 'App\\Models\\User', 1, 'auth_token', '12569792cd2964d591e3e3452cfd32d1271f11bc251fc9f15e5c5781cacc6b1f', '[\"*\"]', NULL, NULL, '2025-04-08 01:21:50', '2025-04-08 01:21:50'),
(3, 'App\\Models\\User', 2, 'auth_token', '32d3fcb7ee52cf28766c0cd0ac447af433998c4c652bf38b0a057d7a4e03a868', '[\"*\"]', NULL, NULL, '2025-04-08 01:22:05', '2025-04-08 01:22:05'),
(4, 'App\\Models\\User', 3, 'auth_token', '99a237869e48c1f29aa493eca984ba109e7dce29755b8188fdff516cf56b0ee4', '[\"*\"]', '2025-04-08 01:49:45', NULL, '2025-04-08 01:23:47', '2025-04-08 01:49:45'),
(5, 'App\\Models\\User', 1, 'auth_token', 'a0f591970f5abe27a41dcb88c5b5f5bea3f9e138cd86e4994582f9b2a6ceb4b9', '[\"*\"]', '2025-04-08 20:31:03', NULL, '2025-04-08 06:56:37', '2025-04-08 20:31:03'),
(6, 'App\\Models\\User', 3, 'auth_token', 'fd4460fc4fa5d9009ebf8f8d3feeec75776e8eee2b201708774987617cd105fe', '[\"*\"]', '2025-04-08 20:51:41', NULL, '2025-04-08 20:33:21', '2025-04-08 20:51:41'),
(7, 'App\\Models\\User', 3, 'auth_token', 'eab661719eda26351765dba4b93d4f5d796f175e2b0823877b5ae815af749751', '[\"*\"]', NULL, NULL, '2025-04-09 06:14:55', '2025-04-09 06:14:55'),
(8, 'App\\Models\\User', 3, 'auth_token', '05d36621b88c6db9a1e9f2985199abd59b28074cae03babd70cd1bd7db15a464', '[\"*\"]', NULL, NULL, '2025-04-09 07:40:45', '2025-04-09 07:40:45'),
(9, 'App\\Models\\User', 3, 'auth_token', '979d338ccd7ee7d2697af5eabaca2453a9fedfbb31f8356a41e106b25258e15c', '[\"*\"]', NULL, NULL, '2025-04-09 08:08:00', '2025-04-09 08:08:00'),
(10, 'App\\Models\\User', 3, 'auth_token', '9b80035e625b8fe8d148f80e450aaa63922701570fb86b3ab380a5d635170b09', '[\"*\"]', NULL, NULL, '2025-04-09 08:11:42', '2025-04-09 08:11:42'),
(11, 'App\\Models\\User', 3, 'auth_token', 'd2190e1a427da03f5b4b7ab076b5e2c2b6906c7e383ce46bcf7b474faaf84be9', '[\"*\"]', NULL, NULL, '2025-04-10 02:23:42', '2025-04-10 02:23:42'),
(12, 'App\\Models\\User', 3, 'auth_token', '3003f94856987cb6e43cb96d204a692d688399b096baf1dd0b0dd7c98ac010ce', '[\"*\"]', '2025-04-11 06:17:56', NULL, '2025-04-10 06:59:38', '2025-04-11 06:17:56'),
(13, 'App\\Models\\User', 2, 'auth_token', '9caa07034bc62e38f2f6a7e9f5f231792b79ea17f23eaefb6c981a2aee9a94c6', '[\"*\"]', NULL, NULL, '2025-04-11 06:20:27', '2025-04-11 06:20:27'),
(14, 'App\\Models\\User', 3, 'auth_token', '2b1ea378996f4f527fbae58543a42af28740527df7a5c8bacb38ae1ba6c77645', '[\"*\"]', '2025-04-11 06:39:50', NULL, '2025-04-11 06:22:29', '2025-04-11 06:39:50'),
(15, 'App\\Models\\User', 3, 'auth_token', '964be58e78f375e3b5429eecded97a8ea7fda90f2fab762672b4e7f3e95d5ac1', '[\"*\"]', '2025-04-11 06:41:54', NULL, '2025-04-11 06:41:29', '2025-04-11 06:41:54'),
(16, 'App\\Models\\User', 3, 'auth_token', 'cb213296f96d9b8a3e5aff406d244bd6869c484d74a8dbdff9e95e957f6d165c', '[\"*\"]', '2025-04-11 07:05:05', NULL, '2025-04-11 06:43:26', '2025-04-11 07:05:05'),
(17, 'App\\Models\\User', 3, 'auth_token', '89c6d5a24ebf8ea0495abfc2f389c0ba84717b19df3c3b2019baedb36efedfe4', '[\"*\"]', '2025-04-12 06:00:47', NULL, '2025-04-11 07:18:25', '2025-04-12 06:00:47'),
(18, 'App\\Models\\User', 1, 'auth_token', 'da9f96c8ca6390e88c6105abc0d6c5fca1eeddc3a6328a00503d6b426ab705b4', '[\"*\"]', '2025-04-15 02:07:35', NULL, '2025-04-15 01:07:29', '2025-04-15 02:07:35'),
(19, 'App\\Models\\User', 1, 'auth_token', '63015e0200ab222fb9d6f2f019d7a540aad56aee94e3b4aa0423dec5fc1ebdce', '[\"*\"]', '2025-04-15 02:17:37', NULL, '2025-04-15 02:11:19', '2025-04-15 02:17:37'),
(20, 'App\\Models\\User', 3, 'auth_token', '9cdcd82b02c04583fdeb0fb210c2384fd566d17b26350e373b34164b102a59ed', '[\"*\"]', '2025-04-15 06:24:14', NULL, '2025-04-15 02:19:52', '2025-04-15 06:24:14'),
(21, 'App\\Models\\User', 1, 'auth_token', '8c340a852f9b3a276bd026f0dabb09326cdda0b6dc3144b9fadb344906b7b37b', '[\"*\"]', NULL, NULL, '2025-04-15 06:44:20', '2025-04-15 06:44:20'),
(22, 'App\\Models\\User', 3, 'auth_token', 'bb459b50a889140eec7c345cc9ae59db5de9d6856a1ce69a1c8bb59a872bf244', '[\"*\"]', '2025-04-15 07:18:38', NULL, '2025-04-15 07:02:02', '2025-04-15 07:18:38'),
(23, 'App\\Models\\User', 3, 'auth_token', 'adb5b8f0371423905458f385220264110534ffe9076713cd8f297caa0af0cf91', '[\"*\"]', '2025-04-20 05:36:19', NULL, '2025-04-20 05:34:08', '2025-04-20 05:36:19');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_category` int UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `products_id_category_foreign` (`id_category`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `description`, `image`, `id_category`, `created_at`, `updated_at`) VALUES
(1, 'ÁO THUN GẤU RICH', 89000, 'Áo cho thú cưng có GẤU RICH\n\n✅ Chất liệu: 100% thun cotton co dãn 4 chiều 😊\n\n✅ Màu sắc: trắng cam\n\n✅ Kích thước : S - 4XL', 'https://lylyphukienthucung.com/gw-content/images/img2545-MtsMS.jpeg', 1, '2025-03-30 22:15:53', '2025-03-30 22:15:53'),
(2, 'NỆM VUÔNG MÙA HÈ CHO PET DƯỚI 6KG', 150000, 'NỆM VUÔNG MÙA HÈ CHO PET DƯỚI 6KG\n\nKích thước: 55x45cm\n✅ Màu sắc, hoạ tiết đẹp mắt\n✅ Dáng vuông, có thành cho các bé gối đầu\n✅ Nệm êm, thoải mái, form dáng chắc chắn. \n✅ Chất liệu dễ vệ sinh, giặt tay hoặc máy đều được', 'https://lylyphukienthucung.com/gw-content/images/z6338459808367b79b52367633b4c383e25ed9168ea0a4copy-D1MB6.jpg', 1, '2025-03-30 22:56:19', '2025-03-30 22:56:19'),
(3, 'Chuồng Chó Mèo Vận Chuyển Hàng Không', 250000, 'Chuồng chó mèo vận chuyển hàng không là một sản phẩm được thiết kế đặc biệt để đảm bảo an toàn và thoải mái cho chó mèo khi đi du lịch hoặc di chuyển bằng máy bay. Tương tự như các balo thú cưng, Chuồng được làm bằng vật liệu nhẹ nhưng chắc chắn, có các lỗ thông gió để đảm bảo hơi thở tốt cho chúng', 'https://paddy.vn/cdn/shop/files/long-van-chuyen-cho-meo.png?v=1710142321', 2, '2025-03-31 05:41:06', '2025-03-31 05:41:06'),
(4, 'Ổ Nằm Dây Thừng Cho Mèo Cào Móng CattyMan', 150000, 'Ổ Tròn Bện Dây Thừng Cho Mèo Nằm & Cào Móng CattyMan\n\nTính năng sản phẩm\n- Nôi bằng dây thừng dành cho mèo, phù hợp cho các bé dưới 6kg\n- Dành cho mèo chơi đùa, xã stress.\n- Có thể làm tổ mèo.\n- Sản xuất tại Việt Nam theo tiêu chuẩn xuất khẩu Nhật Bản\n\nChất liệu : Form Eva, Dây đay, Polyester', 'https://paddy.vn/cdn/shop/files/o-nam-day-thung-meo-cao-mong-cattyman-6kg.jpg?v=1694500594', 2, '2025-03-31 05:42:53', '2025-03-31 05:42:53'),
(5, 'Thức ăn cho mèo con vị cá hồi cá ngừ PURINA PRO PLAN Kitten Starter', 300000, 'Thức ăn cho mèo con từ 1 tháng tuổi trở lên, vị cá hồi cá ngừ PURINA PRO PLAN Kitten Starter là sản phẩm kết hợp tất cả các dưỡng chất thiết yếu bao gồm DHA hỗ trợ phát triển trí não và vitamin C, D cùng sữa non để phát triển hệ miễn dịch khỏe mạnh trong chế độ ăn giàu protein dành riêng cho mèo con.\n\nMèo con nên được cho ăn khi được 3 đến 4 tuần tuổi. Nên ngâm sản phẩm với nước ấm để giữ nguyên chất dinh dưỡng và dễ ăn hơn. Khi được 5-6 tuần, bắt đầu giảm lượng nước bổ sung cho đến khi mèo con có thể ăn thức ăn khô. Khi mèo con của bạn đã được 6 tháng tuổi, hãy chuyển sang thức ăn dành cho độ tuổi lớn hơn.', 'https://www.petmart.vn/wp-content/uploads/2023/08/thuc-an-cho-meo-con-vi-ca-hoi-ca-ngu-purina-pro-plan-kitten-starter.jpg', 3, '2025-04-01 22:51:12', '2025-04-01 22:51:12'),
(6, 'Thức ăn cho mèo NATURAL CORE Bene Chicken Salmon', 250000, 'Thức ăn cho mèo NATURAL CORE Bene Chicken Salmon với hương vị và dinh dưỡng tuyệt vời, sử dụng nguồn đạm động vật chất lượng cao, giúp ích cho sự phát triển và sức khỏe của mèo con.', 'https://www.petmart.vn/wp-content/uploads/2023/05/thuc-an-cho-meo-natural-core-bene-chicken-salmon.jpg', 3, '2025-04-01 22:52:08', '2025-04-01 22:52:08'),
(7, 'Chuồng nhựa cho chó mèo XINDING Kennel XDB-438', 500000, 'Chuồng nhựa cho chó mèo XINDING Kennel XDB-438 mang đến cho thú cưng của bạn một ngôi nhà hiện đại, tiện dụng. Sản phẩm có thể đặt ở bất cứ nơi đâu trong căn nhà của bạn, mà vẫn phù hợp với nội thất chung. Sản phẩm phù hợp với các giống chó và mèo nhỏ. XINDING Kennel XDB-438 có thể mở được cánh cửa ngang và cửa phía trên của chuồng.', 'https://www.petmart.vn/wp-content/uploads/2021/07/chuong-cho-cho-meo-xinding-kennel-xdb-438.jpg', 2, '2025-04-01 22:53:17', '2025-04-01 22:53:17'),
(8, 'Chuồng mèo 3 tầng nan sắt AUPET Deluxe 3-Layer Cage', 500000, 'Chuồng mèo 3 tầng nan sắt AUPET Deluxe 3-Layer Cage đem lại sự thoải mái cho mèo cưng. Sàn tầng trong chuồng có thể là sàn nan sắt hoặc sàn nhựa cói tùy từng lô hàng.\n\nChuồng mèo với thiết kế sang trọng có kết cấu chắc chắn đảm bảo an toàn cho thú cưng. Với lớp sơn sắt trắng bóng cao cấp chống gỉ giúp tăng độ bền và dễ dàng khi vệ sinh. Cửa trước có thể đảo ngược, giúp kiểm soát an toàn, cho mèo dễ dàng ra vào cũng như định vị một cách linh hoạt. Võng phía trên giúp mèo nghỉ ngơi và thư giãn. AUPET Deluxe 3-Layer Cage có 5 bánh xe, 4 bánh 4 góc và 1 bánh ở giữa dễ dàng di chuyển theo ý muốn.\n\nChuồng mèo 3 tầng nan sắt AUPET Deluxe 3-Layer Cage đóng bao nguyên thùng, trong trường hợp nếu quý khách muốn lắp sẵn, vui lòng yêu cầu nhân viên hỗ trợ.', 'https://www.petmart.vn/wp-content/uploads/2021/07/chuong-meo-3-tang-nan-sat-aupet-deluxe-3-layer-cage.jpg', 2, '2025-04-01 22:53:58', '2025-04-01 22:53:58'),
(9, 'Quần áo cho chó mèo AMBABY PET 2JXF164', 200000, 'Quần áo cho chó mèo AMBABY PET 2JXF164 là sản phẩm dành cho cả chó và mèo.', 'https://www.petmart.vn/wp-content/uploads/2019/06/quan-ao-cho-cho-meo-ambaby-pet-2jxf164-768x768.jpg', 1, '2025-04-08 06:57:44', '2025-04-08 06:57:44'),
(10, 'Yếm cho chó mèo kèm dây dắt AMBABY PET 1JXS058', 230000, 'Yếm cho chó mèo kèm dây dắt AMBABY PET 1JXS058 là sản phẩm dành cho tất cả giống chó và mèo.', 'https://www.petmart.vn/wp-content/uploads/2019/06/yem-cho-cho-meo-kem-day-dat-ambaby-pet-1jxs058.jpg', 4, '2025-04-08 06:58:54', '2025-04-08 06:58:54'),
(11, 'Quần áo cho chó mèo AMBABY PET 2JXF101', 245000, 'Quần áo cho chó mèo AMBABY PET 2JXF101 là sản phẩm dành cho cả chó và mèo.', 'https://www.petmart.vn/wp-content/uploads/2019/06/yem-cho-cho-meo-kem-day-dat-ambaby-pet-1jxs054.jpg', 4, '2025-04-08 06:59:26', '2025-04-08 06:59:26'),
(12, 'Yếm cho chó mèo kèm dây dắt AMBABY PET 1JXS054', 220000, 'Quần áo cho chó mèo AMBABY PET 2JXF101 là sản phẩm dành cho cả chó và mèo.', 'https://www.petmart.vn/wp-content/uploads/2019/06/quan-ao-cho-cho-meo-ambaby-pet-2jxf101-768x768.jpg', 4, '2025-04-08 07:01:09', '2025-04-08 07:01:09'),
(13, 'Khay vệ sinh cho chó thành cao IRIS OHYAMA TRT650', 1000, 'Khay vệ sinh cho chó thành cao IRIS OHYAMA TRT650 với thiết kế hình vuông nhỏ gọn, thuận tiện cho việc cún cưng đi vệ sinh. Phù hợp với các giống chó lớn nhỏ khác nhau như Poodle, Phốc, Phốc sóc…', 'https://www.petmart.vn/wp-content/uploads/2019/06/ve-sinh-cho-cho-thanh-cao-iris-trt650.jpg', 5, '2025-04-08 07:06:39', '2025-04-11 06:22:13');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `google_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` int NOT NULL DEFAULT '0',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_google_id_unique` (`google_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `google_id`, `phone`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Thong Hoang', 'thonghoang550@gmail.com', NULL, '12412421', NULL, '$2y$12$aRpSgZ5py5pzx3A8iPh3hubrvjqM287vzIuUQFxk8O7ZS6eUIBM9m', 1, NULL, '2025-03-29 05:36:02', '2025-03-30 22:17:09'),
(2, 'Admin1', 'admin@gmail.com', NULL, '124124124', NULL, '$2y$12$81GHn.Ien5DrOVGLSrcIfOZkoyCMEv4fTVg1NVdyb7LPf6pD2MJD.', 1, NULL, '2025-03-29 05:42:19', '2025-03-30 22:17:01'),
(3, 'user1', 'user1@gmail.com', NULL, '5151284821', NULL, '$2y$12$D/f72z0FFTFX5ozkyiIOHeI5RAfqAEDRtUC2xpm4i8Llie41Gkr4S', 0, NULL, '2025-04-04 01:52:16', '2025-04-04 01:52:16'),
(5, 'user6', 'user6@gmail.com', NULL, '12412413212', NULL, '$2y$12$Wc6ZbTcIj8OGO2m7qNS96eoq3sf3sqm9ZnCkudfnGmfWXb0.uUnxm', 0, NULL, '2025-04-15 07:03:13', '2025-04-15 07:03:13');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `carts_detail`
--
ALTER TABLE `carts_detail`
  ADD CONSTRAINT `carts_detail_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `carts_detail_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `order_details_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_id_category_foreign` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
