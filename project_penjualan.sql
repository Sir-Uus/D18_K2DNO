-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 04, 2024 at 05:46 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_penjualan`
--

-- --------------------------------------------------------

--
-- Table structure for table `dataproduk`
--

CREATE TABLE `dataproduk` (
  `id_produk` int(11) NOT NULL,
  `namaproduk` varchar(100) NOT NULL,
  `stock` int(11) NOT NULL,
  `hargasatuan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dataproduk`
--

INSERT INTO `dataproduk` (`id_produk`, `namaproduk`, `stock`, `hargasatuan`) VALUES
(1, 'Bakso', 20, 3000),
(2, 'Teh Pucuk less sugar', 95, 5000),
(3, 'Kopi ABC', 100, 5000),
(4, 'Kamaludi', 96, 5700000),
(14, 'Bakso cumi', 50, 13000);

-- --------------------------------------------------------

--
-- Table structure for table `datatransaksi`
--

CREATE TABLE `datatransaksi` (
  `id` int(11) NOT NULL,
  `id_produk` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `tanggal` datetime NOT NULL,
  `hargatotal` int(11) NOT NULL,
  `id_karyawan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `datatransaksi`
--

INSERT INTO `datatransaksi` (`id`, `id_produk`, `quantity`, `tanggal`, `hargatotal`, `id_karyawan`) VALUES
(1, 1, 10, '2024-06-04 00:00:00', 30000, 1),
(2, 1, 5, '2024-06-04 00:00:00', 15000, 0),
(3, 2, 5, '2024-05-28 00:00:00', 25000, 0),
(4, 1, 12, '2024-06-03 00:00:00', 36000, 0),
(5, 1, 12, '2024-05-30 00:00:00', 36000, 10000),
(6, 1, 7, '0000-00-00 00:00:00', 21000, 0),
(7, 1, 4, '2024-05-29 00:00:00', 12000, 2),
(8, 2, 2, '2024-06-06 00:00:00', 10000, 3),
(9, 1, 3, '2024-06-04 00:00:00', 9000, 1),
(10, 1, 9, '1998-08-07 00:00:00', 27000, 1),
(11, 2, 2, '0000-00-00 00:00:00', 10000, 2),
(12, 2, 9, '0000-00-00 00:00:00', 45000, 1);

-- --------------------------------------------------------

--
-- Table structure for table `data_investor`
--

CREATE TABLE `data_investor` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `jumlah` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data_investor`
--

INSERT INTO `data_investor` (`id`, `nama`, `jumlah`) VALUES
(1, 'Raga', 15000000),
(4, 'Toni oki', 78000000);

-- --------------------------------------------------------

--
-- Table structure for table `data_karyawan`
--

CREATE TABLE `data_karyawan` (
  `id` int(11) NOT NULL,
  `nama_karyawan` varchar(25) NOT NULL,
  `tgl_lahir` varchar(20) NOT NULL,
  `jenis_kelamin` varchar(5) NOT NULL,
  `alamat` varchar(25) NOT NULL,
  `noTlp` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data_karyawan`
--

INSERT INTO `data_karyawan` (`id`, `nama_karyawan`, `tgl_lahir`, `jenis_kelamin`, `alamat`, `noTlp`) VALUES
(1, 'raga', '12-09-2008', 'L', 'Ngawi', '081556444780'),
(2, 'Kolil', '09-09-2009', 'L', 'Jl Bandung', '089122453661'),
(3, 'Ahmad', '09-08-2010', 'L', 'Jl Sura', '082334516778'),
(5, 'Mas Bintang', '09-02-2000', 'L', 'Ngawi', '08982726262');

-- --------------------------------------------------------

--
-- Table structure for table `data_user`
--

CREATE TABLE `data_user` (
  `id` int(11) NOT NULL,
  `nama` varchar(50) NOT NULL,
  `username` varchar(12) NOT NULL,
  `password` varchar(11) NOT NULL,
  `kontak` varchar(12) NOT NULL,
  `role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data_user`
--

INSERT INTO `data_user` (`id`, `nama`, `username`, `password`, `kontak`, `role`) VALUES
(1, 'Mas Bintang', 'admin', 'admin', '085889765342', 'karyawan'),
(3, 'Firdaus', 'admin', 'admin', '081353978776', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dataproduk`
--
ALTER TABLE `dataproduk`
  ADD PRIMARY KEY (`id_produk`);

--
-- Indexes for table `datatransaksi`
--
ALTER TABLE `datatransaksi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idproduk` (`id_produk`),
  ADD KEY `id_karyawan` (`id_karyawan`),
  ADD KEY `id_produk` (`id_produk`);

--
-- Indexes for table `data_investor`
--
ALTER TABLE `data_investor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `data_karyawan`
--
ALTER TABLE `data_karyawan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `data_user`
--
ALTER TABLE `data_user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dataproduk`
--
ALTER TABLE `dataproduk`
  MODIFY `id_produk` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `datatransaksi`
--
ALTER TABLE `datatransaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `data_investor`
--
ALTER TABLE `data_investor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `data_karyawan`
--
ALTER TABLE `data_karyawan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `data_user`
--
ALTER TABLE `data_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
