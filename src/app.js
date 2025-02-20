const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const corsOptions = {
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"],
}

const appointmentRoutes = require('./routes/appoiment');
const AppoimentModel = require('./models/Appoiment');

const app = express();
const appoiment = new AppoimentModel();

app.use(express.json());
app.use(cors(corsOptions));


// Rutas
app.use('/api/appointments', appointmentRoutes);

const fullMongoURI = `${process.env.MONGO_URI}/${process.env.MONGO_DB_NAME}`;

mongoose.connect(fullMongoURI)  
  .then(() => console.log('Conexión a MongoDB exitosa'))
  .catch((err) => console.error('Error al conectar a MongoDB', err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
