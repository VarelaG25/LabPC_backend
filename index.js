require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado exitosamente a MongoDB"))
  .catch((error) => console.error("Error al conectar a MongoDB:", error));

// Rutas (las definiremos a continuación)
app.use("/api/usuarios", require("./routes/UserRoutes"));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
