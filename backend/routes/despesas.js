const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST - Cadastrar uma nova despesa
router.post('/', async (req, res) => {
    let conn;
    try {
        const { veiculo_id, data_despesa, tipo_despesa, valor, obs } = req.body;
        conn = await pool.getConnection();

        const query = `
            INSERT INTO despesas (veiculo_id, data_despesa, tipo_despesa, valor, obs) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const result = await conn.query(query, [veiculo_id, data_despesa, tipo_despesa, valor, obs]);

        res.status(201).json({ 
            mensagem: "Despesa registrada com sucesso!", 
            id: Number(result.insertId) 
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao registrar despesa: " + err.message });
    } finally {
        if (conn) conn.end();
    }
});

// GET - Listar despesas de um veículo específico
router.get('/veiculo/:id', async (req, res) => {
    let conn;
    try {
        const { id } = req.params;
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM despesas WHERE veiculo_id = ? ORDER BY data_despesa DESC", [id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar despesas." });
    } finally {
        if (conn) conn.end();
    }
});

module.exports = router;