const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Importação das Rotas
const marcasRoutes = require('./routes/marcas'); 
const modelosRoutes = require('./routes/modelos');
const veiculosRoutes = require('./routes/veiculos');
const usuariosRoutes = require('./routes/usuarios');
const cidadesRoutes = require('./routes/cidades');
const alocacoesRoutes = require('./routes/alocacoes');
const manutencoesRoutes = require('./routes/manutencoes');
const despesasRoutes = require('./routes/despesas');


// Definição das Rotas
app.use('/api/marcas', marcasRoutes);
app.use('/api/modelos', modelosRoutes);
app.use('/api/veiculos', veiculosRoutes); 
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/cidades', cidadesRoutes);
app.use('/api/alocacoes', alocacoesRoutes);
app.use('/api/manutencoes', manutencoesRoutes);
app.use('/api/despesas', despesasRoutes);

// Rota inicial
app.get('/', (req, res) => {
    res.send('API do Sistema de Frotas de Veículos rodando com sucesso!');
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ Servidor ativo em http://localhost:${PORT}`);
});



