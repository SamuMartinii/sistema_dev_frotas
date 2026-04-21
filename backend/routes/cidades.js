const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST: Cadastrar Cidade
router.post('/', async (req, res) => {
    let conn;
    try {
        const { nome, uf, cep, obs } = req.body;
        conn = await pool.getConnection();
        
        const query = "INSERT INTO cidades (nome, uf, cep, obs) VALUES (?, ?, ?, ?)";
        const result = await conn.query(query, [nome, uf, cep, obs]);
        
        res.status(201).json({ id: Number(result.insertId), nome, uf, cep });
    } catch (err) {
        res.status(500).json({ error: "Erro ao cadastrar cidade." });
    } finally {
        if (conn) conn.end();
    }
});

// GET: Listar Cidades
router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM cidades");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar cidades." });
    } finally {
        if (conn) conn.end();
    }
});

// PUT: Editar uma cidade existente
router.put('/:id', async (req, res) => {
    let conn;
    try {
        const { id } = req.params; // Pega o ID da URL (ex: /api/cidades/1)
        const { nome, uf, cep, obs } = req.body;
        
        conn = await pool.getConnection();
        
        const query = `
            UPDATE cidades 
            SET nome = ?, uf = ?, cep = ?, obs = ? 
            WHERE id = ?
        `;
        
        await conn.query(query, [nome, uf, cep, obs, id]);
        
        res.json({ mensagem: "Cidade atualizada com sucesso!", id, nome, uf });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar cidade: " + err.message });
    } finally {
        if (conn) conn.end();
    }
});

module.exports = router;