// ------------------------------
// app.js - Archivo principal
// ------------------------------
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Configuración de middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de conexión a Aurora RDS
const dbConfig = {
  host: 'database-1.c6bkqwk8eqtu.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '1234567890#2025#',
  database: 'database-1'
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Ruta principal - Servir HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API para obtener todos los estudiantes
app.get('/api/estudiantes', (req, res) => {
  pool.query('SELECT * FROM estudiantes', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
    res.json(results);
  });
});

// API para agregar estudiante
app.post('/api/estudiantes', (req, res) => {
  const { nombre, email, carrera } = req.body;
  
  if (!nombre || !email || !carrera) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  
  const query = 'INSERT INTO estudiantes (nombre, email, carrera) VALUES (?, ?, ?)';
  
  pool.query(query, [nombre, email, carrera], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al insertar en la base de datos' });
    }
    res.status(201).json({ id: results.insertId, mensaje: 'Estudiante agregado correctamente' });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
