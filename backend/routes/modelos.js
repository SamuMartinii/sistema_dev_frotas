const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST
router.post('/', async (req, res) => {
    let conn;
    try {
        // Dados através do Thunder Client / Frontend
        const { nome, ano, marca_id, obs } = req.body;
        
        conn = await pool.getConnection();
        
        // Inserção no banco de dados
        const query = "INSERT INTO modelos (nome, ano, marca_id, obs) VALUES (?, ?, ?, ?)";
        const result = await conn.query(query, [nome, ano, marca_id, obs]);
        
        // OK
        res.status(201).json({ 
            id: Number(result.insertId), 
            nome, 
            ano, 
            marca_id, 
            obs 
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao cadastrar modelo: " + err.message });
    } finally {
        if (conn) conn.end();
    }
});

module.exports = router;