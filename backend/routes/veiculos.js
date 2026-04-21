const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST
router.post('/', async (req, res) => {
    let conn;
    try {
        const { modelo_id, placa, cor, tipo_veiculo, qtd_eixos, capacidade_carga, obs } = req.body;
        
        conn = await pool.getConnection();
        
        // 'D'- Disponível
        const query = `
            INSERT INTO veiculos 
            (modelo_id, placa, cor, tipo_veiculo, qtd_eixos, capacidade_carga, obs, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'D')
        `;
        
        const result = await conn.query(query, [
            modelo_id, placa, cor, tipo_veiculo, qtd_eixos, capacidade_carga, obs
        ]);
        
        res.status(201).json({ 
            id: Number(result.insertId), 
            modelo_id, 
            placa, 
            status: 'D' 
        });
    } catch (err) {
        res.status(500).json({ error: "Erro ao cadastrar veículo: " + err.message });
    } finally {
        if (conn) conn.end();
    }
});

module.exports = router;