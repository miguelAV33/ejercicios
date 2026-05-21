-- =====================================================
-- NavaPark2 — Script de base de datos
-- Parque de atracciones · Navarredonda de Gredos
-- =====================================================

CREATE DATABASE IF NOT EXISTS navapark2
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE navapark2;

-- --------------------------------------------------
-- TABLA: usuarios
-- --------------------------------------------------
CREATE TABLE usuarios (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  fecha_nac   DATE NOT NULL,
  rol         ENUM('cliente','admin') NOT NULL DEFAULT 'cliente',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------------
-- TABLA: atracciones
-- --------------------------------------------------
CREATE TABLE atracciones (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(150) NOT NULL,
  tematica    VARCHAR(200) NOT NULL,
  descripcion TEXT,
  activa      TINYINT(1) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------------
-- TABLA: viajes  (relación N:M entre usuarios y atracciones)
-- Guarda la edad en el momento del viaje para conservar el dato histórico
-- --------------------------------------------------
CREATE TABLE viajes (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id   INT NOT NULL,
  atraccion_id INT NOT NULL,
  hora_viaje   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  edad_viajero INT NOT NULL COMMENT 'Edad calculada en el momento del viaje',
  CONSTRAINT fk_v_usuario   FOREIGN KEY (usuario_id)   REFERENCES usuarios(id)   ON DELETE CASCADE,
  CONSTRAINT fk_v_atraccion FOREIGN KEY (atraccion_id) REFERENCES atracciones(id) ON DELETE CASCADE,
  INDEX idx_usuario   (usuario_id),
  INDEX idx_atraccion (atraccion_id),
  INDEX idx_hora      (hora_viaje)
) ENGINE=InnoDB;

-- --------------------------------------------------
-- DATOS DE EJEMPLO
-- password de todos los usuarios: password
-- (hash bcrypt de 'password')
-- --------------------------------------------------
INSERT INTO usuarios (nombre, email, password, fecha_nac, rol) VALUES
('Admin NavaPark',  'admin@navapark2.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1985-03-15', 'admin'),
('María García',    'maria@example.com',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1998-06-20', 'cliente'),
('Carlos López',    'carlos@example.com',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2005-11-08', 'cliente'),
('Lucía Martínez',  'lucia@example.com',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '2010-02-14', 'cliente');

INSERT INTO atracciones (nombre, tematica, descripcion) VALUES
('El Toro de Gredos',      'Western montañés',     'Rodeo salvaje inspirado en los toros serranos. ¡Aguanta 8 segundos!'),
('La Mina de Plata',       'Aventura subterránea',  'Vagoneta por las antiguas minas de cuarzo de la sierra.'),
('Cumbres del Terror',     'Horror alpino',          'Teleférico encantado entre niebla y picos helados.'),
('El Río Tormes Loco',     'Aventura acuática',      'Descenso en balsa por los rápidos del nacimiento del Tormes.'),
('Nava Espacial',          'Ciencia ficción',        'Simulador de lanzamiento desde la Nava hacia las estrellas.'),
('El Castillo Encantado',  'Medieval fantasía',      'Laberinto interactivo en un castillo templario.'),
('Buitres en Vuelo',       'Naturaleza extrema',     'Tirolina panorámica sobrevolando el valle.'),
('La Leyenda del Berrueco','Mitología gredana',      'Dark ride sobre las leyendas de la Sierra de Gredos.');

INSERT INTO viajes (usuario_id, atraccion_id, hora_viaje, edad_viajero) VALUES
(2, 1, '2025-07-15 10:30:00', 27),
(2, 3, '2025-07-15 11:45:00', 27),
(2, 7, '2025-07-15 14:20:00', 27),
(3, 2, '2025-07-15 10:00:00', 19),
(3, 4, '2025-07-15 12:30:00', 19),
(3, 5, '2025-07-15 16:00:00', 19),
(4, 6, '2025-07-15 11:00:00', 15),
(4, 8, '2025-07-15 13:15:00', 15),
(2, 5, '2025-07-16 09:45:00', 27),
(3, 1, '2025-07-16 10:30:00', 19);
