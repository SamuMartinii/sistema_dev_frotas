const express = require('express');
const router = express.Router();

let modelos = [
    { id: 1, nome: 'Gol', marcaId: 1 },
    { id: 2, nome: 'Mustang', marcaId: 2 }
];

// Listagem dos modelos
router.get('/', (req, res) => {
    res.json(modelos);
});

// Cadastro dos modelos
router.post('/', (req, res) => {
    const { nome, marcaId } = req.body;
    const novoModelo = { id: modelos.length + 1, nome, marcaId };
    modelos.push(novoModelo);
    res.status(201).json(novoModelo);
});

module.exports = router;