DROP DATABASE IF EXISTS `tpf_db_d`;
CREATE DATABASE IF NOT EXISTS tpf_db_d;
USE tpf_db_d;

CREATE TABLE IF NOT EXISTS usuarios (
  id int NOT NULL AUTO_INCREMENT,
  email varchar(255) DEFAULT NULL,
  usuario varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  activo tinyint(1) DEFAULT NULL,
  perfil varchar(255) DEFAULT NULL,
  nombres varchar(255) DEFAULT NULL,
  apellido varchar(255) DEFAULT NULL,
  dni varchar(255) DEFAULT NULL,
  telefono varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS locales (
  id int NOT NULL AUTO_INCREMENT,
  numero varchar(255) DEFAULT NULL,
  nombre varchar(255) DEFAULT NULL,
  superficie varchar(255) DEFAULT NULL,
  habilitado tinyint(1) DEFAULT NULL,
  costoMes float DEFAULT NULL,
  logo varchar(255) DEFAULT NULL,
  imagen varchar(255) DEFAULT NULL,
  alquilado tinyint(1) DEFAULT NULL,
  rubro varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY numero (numero)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS alquileres (
  id int NOT NULL AUTO_INCREMENT,
  numeroAlquiler varchar(255) NOT NULL,
  cantidadMesAlquiler int DEFAULT NULL,
  plazoMes int DEFAULT NULL,
  costoAlquiler float DEFAULT NULL,
  fechaAlquiler datetime DEFAULT NULL,
  localId int DEFAULT NULL,
  usuarioId int DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY numeroAlquiler (numeroAlquiler),
  KEY localId (localId),
  KEY usuarioId (usuarioId),
  CONSTRAINT alquileres_ibfk_1 FOREIGN KEY (localId) REFERENCES locales (id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT alquileres_ibfk_2 FOREIGN KEY (usuarioId) REFERENCES usuarios (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS cuotas (
  id int NOT NULL AUTO_INCREMENT,
  monto float DEFAULT NULL,
  fechaCreacion datetime DEFAULT NULL,
  fechaVencimiento datetime DEFAULT NULL,
  recargoAplicado tinyint(1) DEFAULT NULL,
  fechaPago datetime DEFAULT NULL,
  medioPago varchar(255) DEFAULT NULL,
  cuponQr varchar(255) DEFAULT NULL,
  pagado tinyint(1) DEFAULT NULL,
  alquilerId int DEFAULT NULL,
  PRIMARY KEY (id),
  KEY alquilerId (alquilerId),
  CONSTRAINT cuotas_ibfk_1 FOREIGN KEY (alquilerId) REFERENCES alquileres (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS novedades (
  id int NOT NULL AUTO_INCREMENT,
  descripcion varchar(255) DEFAULT NULL,
  estado varchar(255) DEFAULT NULL,
  alquilerId int DEFAULT NULL,
  PRIMARY KEY (id),
  KEY alquilerId (alquilerId),
  CONSTRAINT novedades_ibfk_1 FOREIGN KEY (alquilerId) REFERENCES alquileres (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS promociones (
  id int NOT NULL AUTO_INCREMENT,
  fechaInicio datetime DEFAULT NULL,
  fechaFin datetime DEFAULT NULL,
  descripcion varchar(255) DEFAULT NULL,
  imagen varchar(255) DEFAULT NULL,
  disponible tinyint(1) DEFAULT NULL,
  alquilerId int DEFAULT NULL,
  PRIMARY KEY (id),
  KEY alquilerId (alquilerId),
  CONSTRAINT promociones_ibfk_1 FOREIGN KEY (alquilerId) REFERENCES alquileres (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET SESSION cte_max_recursion_depth = 1000000;
SET SESSION max_execution_time = 0;

INSERT INTO usuarios (email, usuario, password, activo, perfil, nombres, apellido, dni, telefono)
WITH RECURSIVE seq AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 1000
)
SELECT
  CONCAT('user', n, '@example.com') AS email,
  CONCAT('user', n) AS usuario,
  'password123' AS password,
  1 AS activo,
  'propietario' AS perfil,
  CONCAT('Nombre', n) AS nombres,
  CONCAT('Apellido', n) AS apellido,
  LPAD(n, 8, '0') AS dni,
  CONCAT('1234-56', LPAD(n % 10000, 4, '0')) AS telefono
FROM seq;

INSERT INTO locales (numero, nombre, superficie, habilitado, costoMes, logo, imagen, alquilado, rubro)
WITH RECURSIVE seq AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 1000
)
SELECT
  CONCAT('L', LPAD(n, 5, '0')) AS numero,
  CONCAT('Local ', n) AS nombre,
  ROUND(RAND() * 100 + 20, 2) AS superficie,
  1 AS habilitado,
  ROUND(RAND() * 1000 + 500, 2) AS costoMes,
  NULL AS logo,
  NULL AS imagen,
  0 AS alquilado,
  ELT(FLOOR(RAND() * 5) + 1, 'Ropa', 'Electrónica', 'Gastronomía', 'Servicios', 'Otros') AS rubro
FROM seq;

INSERT INTO alquileres (numeroAlquiler, cantidadMesAlquiler, plazoMes, costoAlquiler, fechaAlquiler, localId, usuarioId)
WITH RECURSIVE seq AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 1000
)
SELECT
  CONCAT('A', LPAD(n, 6, '0')) AS numeroAlquiler,
  FLOOR(RAND() * 12) + 6 AS cantidadMesAlquiler,
  FLOOR(RAND() * 12) + 6 AS plazoMes,
  (SELECT costoMes FROM locales WHERE id = (n % 1000) + 1) * (FLOOR(RAND() * 12) + 6) AS costoAlquiler,
  DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 365) DAY) AS fechaAlquiler,
  (n % 1000) + 1 AS localId,
  n AS usuarioId
FROM seq;

INSERT INTO cuotas (monto, fechaCreacion, fechaVencimiento, recargoAplicado, fechaPago, medioPago, cuponQr, pagado, alquilerId)
SELECT
  a.costoAlquiler / a.cantidadMesAlquiler AS monto,
  DATE_ADD(a.fechaAlquiler, INTERVAL m.n MONTH) AS fechaCreacion,
  DATE_ADD(DATE_ADD(a.fechaAlquiler, INTERVAL m.n MONTH), INTERVAL 10 DAY) AS fechaVencimiento,
  0 AS recargoAplicado,
  CASE WHEN RAND() > 0.3 THEN DATE_ADD(DATE_ADD(a.fechaAlquiler, INTERVAL m.n MONTH), INTERVAL 5 DAY) ELSE NULL END AS fechaPago,
  CASE WHEN RAND() > 0.3 THEN 'Mercado Pago' ELSE NULL END AS medioPago,
  CASE WHEN RAND() > 0.3 THEN 'QR123456' ELSE NULL END AS cuponQr,
  IF(RAND() > 0.3, 1, 0) AS pagado,
  a.id AS alquilerId
FROM alquileres a
JOIN (
  SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
) m ON m.n < a.cantidadMesAlquiler
LIMIT 5000;
-- 1. Crear el usuario para el exportador (acceso desde cualquier host '%')
CREATE USER IF NOT EXISTS 'exporter_user'@'%' IDENTIFIED BY 'exporter_pass';

-- 2. Darle los permisos mínimos necesarios para monitoreo
GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO 'exporter_user'@'%';

-- 3. Aplicar cambios
FLUSH PRIVILEGES;