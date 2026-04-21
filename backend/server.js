const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Importação das Rotas
const marcasRoutes = require('./routes/marcas'); 
const modelosRoutes = require('./routes/modelos');

// Definição das Rotas
app.use('/api/marcas', marcasRoutes);
app.use('/api/modelos', modelosRoutes);

// Rota inicial
app.get('/', (req, res) => {
    res.send('API do Sistema de Frotas de Veículos rodando com sucesso!');
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ Servidor ativo em http://localhost:${PORT}`);
});

const veiculosRoutes = require('./routes/veiculos'); // Coloque junto com as outras importações

app.use('/api/veiculos', veiculosRoutes); // Coloque junto com os outros app.use