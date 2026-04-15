const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota inicial para teste
app.get('/', (req, res) => {
    res.send('API do Sistema de Frotas de Veículos rodando com sucesso! 🚀');
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ Servidor ativo em http://localhost:${PORT}`);
});

const marcasRoutes = require('./routes/marcas'); 
const modelosRoutes = require('./routes/modelos');


app.use('/api/marcas', marcasRoutes);
app.use('/api/modelos', modelosRoutes);