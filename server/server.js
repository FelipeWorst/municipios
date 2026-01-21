const express = require("express");
require("dotenv").config();

const cors = require('cors');

const municipiosRouter = require("./routes/municipios");
const autenticarApi = require("./autorizar");

const app = express();
app.use(cors());
app.use(express.json());



// =====================
// Rotas principais
// =====================
//app.use(autenticarApi);
app.use("/municipios", municipiosRouter);

// Rota raiz
app.get("/", (req, res) => {
  res.send("🌎 API de Municípios rodando! Acesse a documentação em /api-docs");
});

// =====================
// Servidor
// =====================
const PORT = process.env.PORT || 3000;


app.listen(PORT,() => {});
