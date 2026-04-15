const express = require('express');
const router = express.Router();

// Uso teste ate não configuraro MariaDB
let marcas = [
    { id: 1, nome: 'Volkswagen' },
    { id: 2, nome: 'Ford' }
];

// Listagem da marca
router.get('/', (req, res) => {
    res.json(marcas);
});


router.post('/', (req, res) => {
    const { nome } = req.body;
    const novaMarca = { id: marcas.length + 1, nome };
    marcas.push(novaMarca);
    res.status(201).json(novaMarca);
});

module.exports = router;