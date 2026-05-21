-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS poligonos;
USE poligonos;

-- Crear la tabla users
CREATE TABLE IF NOT EXISTS users (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    alias    VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);

-- Usuarios de prueba
INSERT INTO users (alias, password) VALUES ('usuario1', MD5('123'));
INSERT INTO users (alias, password) VALUES ('usuario2', MD5('abc'));
INSERT INTO users (alias, password) VALUES ('admin', MD5('admin123'));
