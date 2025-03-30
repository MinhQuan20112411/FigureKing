-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 05, 2024 lúc 01:09 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

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

--
-- Đang đổ dữ liệu cho bảng `brands`
--

INSERT INTO `brands` (`brand_id`, `brand_name`) VALUES
('brand-1', 'Nike'),
('brand-2', 'Adidas'),
('brand-3', 'Dior'),
('brand-4', 'Chanel'),
('brand-5', 'Vans'),
('brand-6', 'Burberry1');

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
('cate-1', 'Áo Thun'),
('cate-2', 'Áo Hoodie'),
('cate-4', 'Áo Khoác'),
('cate-5', 'Giày/Dép'),
('cate-6', 'Nón');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `follow_order`
--

CREATE TABLE `follow_order` (
  `follow_id` int(11) NOT NULL,
  `order_status` varchar(50) NOT NULL,
  `order_id` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order`
--

CREATE TABLE `order` (
  `order_id` varchar(10) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `pay_status` varchar(50) NOT NULL,
  `acc_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `order_id` varchar(10) NOT NULL,
  `product_id` varchar(10) NOT NULL,
  `quantity_items` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(6, 'ADIDAS OS STADT BEIGE', 3000000.00, NULL, 6, NULL, 'cate-5', 'brand-2', '1730800108056.jpg'),
(7, 'ADIDAS STAN SMITH MICKEY MOUSE', 2000000.00, NULL, 24, NULL, 'cate-5', 'brand-2', '1730800699536.jpg'),
(9, 'DIOR SNEAKERS 02', 3800000.00, NULL, 12, NULL, 'cate-5', 'brand-3', '1730808165652.jpg');

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
  ADD PRIMARY KEY (`order_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `cate_id` (`cate_id`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `products_ibfk_1` (`size_id`);

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
  MODIFY `acc_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `follow_order`
--
ALTER TABLE `follow_order`
  MODIFY `follow_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`);

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`size_id`) REFERENCES `size` (`size_id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`cate_id`) REFERENCES `categories` (`cate_id`),
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
