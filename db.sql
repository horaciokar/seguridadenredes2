CREATE DATABASE IF NOT EXISTS database-1;
USE seguridadenredes2;

CREATE TABLE IF NOT EXISTS estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  carrera VARCHAR(100) NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar algunos datos de ejemplo
INSERT INTO estudiantes (nombre, email, carrera) VALUES
  ('Juan Pérez', 'juan.perez@ejemplo.com', 'Ingeniería Informática'),
  ('María González', 'maria.gonzalez@ejemplo.com', 'Administración de Empresas'),
  ('Carlos Rodríguez', 'carlos.rodriguez@ejemplo.com', 'Medicina');