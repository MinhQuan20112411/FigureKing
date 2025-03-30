-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 26, 2025 lúc 09:13 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `FigureKing`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `account`
--

CREATE TABLE `account` (
  `acc_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `account`
--

INSERT INTO `account` (`acc_id`, `first_name`, `last_name`, `email`, `password`) VALUES
(7, 'Đoàn', 'Đại Nghĩa', 'dn@gmail.com', '123'),
(8, 'Minh', 'Quân', 'mq@gmail.com', '123');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `admin`
--

INSERT INTO `admin` (`admin_id`, `email`, `password`) VALUES
(1, '2254810188@vaa.edu.vn', 'dainghiadainghia'),
(2, '225481005055@vaa.edu.vn', 'minhquanminhquan');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `brands`
--

CREATE TABLE `brands` (
  `brand_id` varchar(10) NOT NULL,
  `brand_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart`
--

CREATE TABLE `cart` (
  `cart_id` int(11) NOT NULL,
  `acc_id` int(11) NOT NULL,
  `product_id` varchar(10) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cart`
--

INSERT INTO `cart` (`cart_id`, `acc_id`, `product_id`, `quantity`, `created_at`, `updated_at`) VALUES
(40, 8, '102', 1, '2025-03-26 08:07:56', '2025-03-26 08:07:56');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `cate_id` varchar(10) NOT NULL,
  `cate_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`cate_id`, `cate_name`) VALUES
('cate-1', 'DragonBall'),
('cate-2', 'Onepiece'),
('cate-4', 'Naruto'),
('cate-5', 'Gundam'),
('cate-7', 'Genshin Impact'),
('cate_6', 'Kimetsu no Yaiba');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `follow_order`
--

CREATE TABLE `follow_order` (
  `follow_id` int(11) NOT NULL,
  `order_status` varchar(50) NOT NULL,
  `order_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `follow_order`
--

INSERT INTO `follow_order` (`follow_id`, `order_status`, `order_id`) VALUES
(14, 'Đã giao hàng', 13),
(15, 'Đã giao hàng', 15),
(16, 'Đã giao hàng', 16),
(17, 'Đã giao hàng', 66),
(18, 'Đã tiếp nhận', 67);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order`
--

CREATE TABLE `order` (
  `order_id` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `pay_status` varchar(50) NOT NULL,
  `acc_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order`
--

INSERT INTO `order` (`order_id`, `address`, `phone_number`, `total`, `pay_status`, `acc_id`, `full_name`) VALUES
(13, '123', '0192837491', 5000000.00, 'Đã thanh toán', 7, 'Đại Nghĩa'),
(15, '123', '0192837491', 10000000.00, 'Đã thanh toán', 7, 'Đại Nghĩa'),
(16, '321', '0192837321', 99999999.99, 'Đã thanh toán', 8, 'Minh Quân'),
(66, '321', '0192837321', 9999000.00, 'Đã thanh toán', 8, 'Minh Quân'),
(67, '321', '0192837321', 8888888.00, 'Đang chờ thanh toán', 8, 'Minh Quân'),
(81, '321', '0192837321', 9999000.00, 'Đã thanh toán', 8, 'Minh Quân');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity_items` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`order_id`, `product_id`, `quantity_items`, `price`) VALUES
(13, 31, 1, 5000000.00),
(15, 41, 1, 10000000.00),
(16, 107, 1, 99999999.99),
(66, 102, 1, 9999000.00),
(67, 103, 1, 8888888.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `size_id` varchar(10) DEFAULT NULL,
  `cate_id` varchar(10) DEFAULT NULL,
  `brand_id` varchar(10) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `cost`, `description`, `quantity`, `size_id`, `cate_id`, `brand_id`, `imageUrl`) VALUES
(31, 'MT01', 5000000.00, '0', 6, NULL, 'cate-5', NULL, '1739977313358.jpg'),
(32, 'MT02', 3000000.00, '0', 3, NULL, 'cate-5', NULL, '1739977545072.jpg'),
(33, 'XLR01', 900000.00, '0', 3, NULL, 'cate-5', NULL, '1739977676010.jpg'),
(34, 'PCR01', 6000000.00, '0', 5, NULL, 'cate-5', NULL, '1739977698856.jpg'),
(35, 'Luffy Gear 5', 10000000.00, '0', 1, NULL, 'cate-2', NULL, '1739977819616.jpg'),
(36, 'Mô hình - Minato', 9000000.00, '0', 4, NULL, 'cate-4', NULL, '1739977856252.jpg'),
(37, 'Naruto Lục Đạo Cửu Vĩ', 15000000.00, '0', 6, NULL, 'cate-4', NULL, '1739978149287.jpg'),
(38, 'Mô hình Zoro', 8000000.00, '0', 8, NULL, 'cate-2', NULL, '1739978470613.jpg'),
(39, 'Naruto', 6000000.00, '0', 9, NULL, 'cate-4', NULL, '1739978996439.jpg'),
(40, 'Mabu lên xà', 500000.00, '0', 12, NULL, 'cate-1', NULL, '1739979098691.jpg'),
(41, 'Gogeta ssj blue', 10000000.00, '0', 5, NULL, 'cate-1', NULL, '1739979125460.png'),
(42, 'Goku cầm ngọc', 900000.00, '0', 12, NULL, 'cate-1', NULL, '1739979148625.jpg'),
(44, 'AAA', 10000000.00, '0', 2, NULL, 'cate-5', NULL, '1740023761487.jpg'),
(45, 'Mô Hình Kaido dạng lai rồng trạng thái chiến đấu', 15000000.00, '0', 10, NULL, 'cate-2', NULL, '1742019302402.jpg'),
(47, 'Mô hình Kokushibo', 11000000.00, '0', 12, NULL, 'cate_6', NULL, '1742019689586.jpg'),
(48, 'Rengoku Kyoujurou', 13000000.00, '0', 6, NULL, 'cate_6', NULL, '1742019740461.jpg'),
(52, 'Kamado Nezuko', 20000000.00, '0', 9, NULL, 'cate_6', NULL, '1742020171848.jpg'),
(53, 'Nezuko Basic Form', 8000000.00, '0', 17, NULL, 'cate_6', NULL, '1742020266217.jpg'),
(94, 'Tony Tony Chopper', 20000000.00, '0', 8, NULL, 'cate-2', NULL, '1742363040115.png'),
(95, 'Shanks', 99999999.99, '0', 13, NULL, 'cate-2', NULL, '1742363061916.jpg'),
(96, 'mo-hinh-goku-va-rong-trai-dat', 2000000.00, '0', 13, NULL, 'cate-1', NULL, '1742363149266.jpg'),
(97, 'Mo-hinh-Naruto-Ban-Than-De-ngu-Tsunade', 600000.00, '0', 38, NULL, 'cate-4', NULL, '1742363192557.jpg'),
(98, 'mo-hinh-naruto-luc-dao-cuu-vi-rasengan', 16000000.00, '0', 99, NULL, 'cate-4', NULL, '1742363239720.jpg'),
(99, 'gohan', 200000.00, '0', 4, NULL, 'cate-1', NULL, '1742363499084.jpg'),
(100, 'Goku Super Saiyan 4', 1800000.00, '0', 10, NULL, 'cate-1', NULL, '1742363625896.jpg'),
(101, 'MUALANI', 3000000.00, '0', 999, NULL, 'cate-7', NULL, '1742385200721.png'),
(102, 'KEQING váy đen', 9999000.00, '0', 90, NULL, 'cate-7', NULL, '1742385258384.png'),
(103, 'KEQING', 8888888.00, '0', 99998, NULL, 'cate-7', NULL, '1742385282445.png'),
(104, 'HUTAO', 6000000.00, '0', 999, NULL, 'cate-7', NULL, '1742385320994.png'),
(105, 'YAE MIKO', 9900000.00, '0', 6231, NULL, 'cate-7', NULL, '1742385354163.png'),
(106, 'LUMINE', 3000000.00, '0', 2222, NULL, 'cate-7', NULL, '1742385391309.png'),
(107, 'FURINA & FORCALOR', 10000000.00, '0', 8763, NULL, 'cate-7', NULL, '1742385429318.png'),
(108, 'GANYU & KEQING', 29990000.00, '0', 99999, NULL, 'cate-7', NULL, '1742385469071.png'),
(109, 'INOSUKE', 333333.00, '0', 333, NULL, 'cate_6', NULL, '1742385720091.jpg'),
(110, 'INOSUKE KHONG MU', 999999.00, '0', 999, NULL, 'cate_6', NULL, '1742385759500.jpg'),
(111, 'UCHIHA', 99999.00, '0', 99, NULL, 'cate-4', NULL, '1742385822892.jpg'),
(112, 'HG1', 888888.00, '0', 888, NULL, 'cate-5', NULL, '1742385907207.jpg'),
(113, 'LUFFY', 10000000.00, '0', 222, NULL, 'cate-2', NULL, '1742385991827.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int(11) NOT NULL,
  `acc_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `review_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `reviews`
--

INSERT INTO `reviews` (`review_id`, `acc_id`, `product_id`, `rating`, `comment`, `review_date`) VALUES
(13, 7, 44, 5, 'Đẹp', '2025-02-20 03:56:49'),
(14, 7, 32, 5, ' ..\n', '2025-02-20 04:09:16');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `size`
--

CREATE TABLE `size` (
  `size_id` varchar(10) NOT NULL,
  `size` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`acc_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`brand_id`);

--
-- Chỉ mục cho bảng `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `acc_id` (`acc_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`cate_id`);

--
-- Chỉ mục cho bảng `follow_order`
--
ALTER TABLE `follow_order`
  ADD PRIMARY KEY (`follow_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Chỉ mục cho bảng `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `acc_id` (`acc_id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD KEY `product_id` (`product_id`),
  ADD KEY `fk_order_id` (`order_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `cate_id` (`cate_id`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `products_ibfk_1` (`size_id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `acc_id` (`acc_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `size`
--
ALTER TABLE `size`
  ADD PRIMARY KEY (`size_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `account`
--
ALTER TABLE `account`
  MODIFY `acc_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT cho bảng `follow_order`
--
ALTER TABLE `follow_order`
  MODIFY `follow_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `order`
--
ALTER TABLE `order`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`acc_id`) REFERENCES `account` (`acc_id`);

--
-- Các ràng buộc cho bảng `follow_order`
--
ALTER TABLE `follow_order`
  ADD CONSTRAINT `follow_order_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`);

--
-- Các ràng buộc cho bảng `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`acc_id`) REFERENCES `account` (`acc_id`);

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_id` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`size_id`) REFERENCES `size` (`size_id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`cate_id`) REFERENCES `categories` (`cate_id`),
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`);

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`acc_id`) REFERENCES `account` (`acc_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
