// server.js
import express from 'express'

const app = express();
const PORT = 3000;  // Puerto de tu servidor Express

// Endpoint simple para pruebas
app.get('/api/data', (req, res) => {
  res.json({ message: 'Este mensaje proviene del servidor Express.' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
