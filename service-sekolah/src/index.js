require("dotenv").config();
const express = require("express"); 
const cors = require("cors");
require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const sekolahRoutes = require("./routes/sekolahRoutes");

const app = express();
const PORT = process.env.PORT || 3003;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API MBG Barokah - Service Sekolah",
      version: "1.0.0",
      description: "Dokumentasi API untuk Manajemen Data Sekolah",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/sekolah", sekolahRoutes);

app.get("/", (req, res) => {
  res.send(`🚀 Service Sekolah sedang berjalan di port ${PORT}`);
});

console.log("--------------------------------------------------");
console.log("✅ Supabase Service Sekolah Aktif");
console.log(`📖 Dokumentasi API: http://localhost:${PORT}/api-docs`);
console.log("--------------------------------------------------");

app.listen(PORT, () => {
  console.log(`🚀 Service Sekolah Online: http://localhost:${PORT}`);
});