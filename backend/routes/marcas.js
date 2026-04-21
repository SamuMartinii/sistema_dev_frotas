const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST
router.post('/', async (req, res) => {
    let conn;
    try {
        const { nome, obs } = req.body;
        conn = await pool.getConnection();
        const resDb = await conn.query("INSERT INTO marcas (nome, obs) VALUES (?, ?)", [nome, obs]);
        res.status(201).json({ id: Number(resDb.insertId), nome, obs });
    } catch (err) {
        res.status(500).json({ error: "Erro ao salvar marca: " + err.message });
    } finally {
        if (conn) conn.end();
    }
});

// GET
router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM marcas");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar marcas" });
    } finally {
        if (conn) conn.end();
    }
});

module.exports = router;