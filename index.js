// server.js
import express from 'express'
import apiRoute from './src/routes/api.js';

const app = express();
const PORT = 3000;  // Puerto de tu servidor Express

app.use(express.json());

// Endpoint simple para pruebas
app.use('/api', apiRoute)

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
