-- Safe to rerun: no existing rows are deleted. Select this whole file in phpMyAdmin SQL.
CREATE DATABASE IF NOT EXISTS web_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE web_app;
CREATE TABLE IF NOT EXISTS Users (
  username VARCHAR(50) PRIMARY KEY,
  password_hash VARCHAR(255) NOT NULL,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  salary DECIMAL(12,2) NOT NULL,
  age INT NOT NULL,
  registerday DATE NOT NULL,
  signintime DATETIME NULL,
  INDEX idx_users_registerday (registerday),
  INDEX idx_users_names (firstname, lastname),
  INDEX idx_users_salary (salary),
  INDEX idx_users_age (age),
  INDEX idx_users_signintime (signintime)
);
