const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST: Enviar veículo para a Oficina Status 'M'
router.post('/', async (req, res) => {
    let conn;
    try {
        const { veiculo_id, data_inicio, descricao } = req.body;
        conn = await pool.getConnection();

        // 1. Verifica se o carro está na garagem ('D')
        const rows = await conn.query("SELECT status FROM veiculos WHERE id = ?", [veiculo_id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: "Veículo não encontrado." });
        }
        if (rows[0].status !== 'D') {
            return res.status(400).json({ error: "Veículo não disponível. Ele já está alocado ou em manutenção." });
        }

        await conn.beginTransaction();

        // Insere a manutenção
        const queryManutencao = "INSERT INTO manutencoes (veiculo_id, data_inicio, descricao) VALUES (?, ?, ?)";
        const result = await conn.query(queryManutencao, [veiculo_id, data_inicio, descricao]);

        // Muda o status do veículo para 'M'
        const queryUpdate = "UPDATE veiculos SET status = 'M' WHERE id = ?";
        await conn.query(queryUpdate, [veiculo_id]);

        await conn.commit();

        res.status(201).json({ 
            mensagem: "Veículo enviado para manutenção com sucesso!", 
            manutencao_id: Number(result.insertId) 
        });

    } catch (err) {
        if (conn) await conn.rollback();
        res.status(500).json({ error: "Erro ao registrar manutenção: " + err.message });
    } finally {
        if (conn) conn.end();
    }
});

// PUT - Retornar da Oficina Status 'D'
router.put('/:id/finalizar', async (req, res) => {
    let conn;
    try {
        const { id } = req.params; // ID da manutenção
        const { data_fim, valor } = req.body;

        conn = await pool.getConnection();
        await conn.beginTransaction();

        // Descobrir o veículo atrelado a esta manutenção
        const rows = await conn.query("SELECT veiculo_id FROM manutencoes WHERE id = ?", [id]);
        if (rows.length === 0) {
            await conn.rollback();
            return res.status(404).json({ error: "Manutenção não encontrada." });
        }
        const veiculo_id = rows[0].veiculo_id;

        // Atualizar a Manutenção com o custo e fim
        const queryManutencao = "UPDATE manutencoes SET data_fim = ?, valor = ? WHERE id = ?";
        await conn.query(queryManutencao, [data_fim, valor, id]);

        // Devolver o carro para a garagem ('D')
        const queryVeiculo = "UPDATE veiculos SET status = 'D' WHERE id = ?";
        await conn.query(queryVeiculo, [veiculo_id]);

        await conn.commit();

        res.json({ mensagem: "Manutenção finalizada! Veículo disponível novamente." });

    } catch (err) {
        if (conn) await conn.rollback();
        res.status(500).json({ error: "Erro ao finalizar manutenção: " + err.message });
    } finally {
        if (conn) conn.end();
    }
});

module.exports = router;