const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST: Registrar nova alocação
router.post('/', async (req, res) => {
    let conn;
    try {
        const { veiculo_id, usuario_id, data_saida, km_inicial, obs } = req.body;
        conn = await pool.getConnection();

        // Verifica se o veículo existe e se está disponível ('D')
        const rows = await conn.query("SELECT status FROM veiculos WHERE id = ?", [veiculo_id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: "Veículo não encontrado." });
        }
        if (rows[0].status !== 'D') {
            return res.status(400).json({ error: "Veículo não está disponível para alocação." });
        }

        await conn.beginTransaction();

        // Insere a Alocação
        const queryAlocacao = "INSERT INTO alocacoes (veiculo_id, usuario_id, data_saida, km_inicial, obs) VALUES (?, ?, ?, ?, ?)";
        const result = await conn.query(queryAlocacao, [veiculo_id, usuario_id, data_saida, km_inicial, obs]);

        // Mudar o status do veículo para 'A' (Alocado)
        const queryUpdate = "UPDATE veiculos SET status = 'A' WHERE id = ?";
        await conn.query(queryUpdate, [veiculo_id]);

        // Ok
        await conn.commit();

        res.status(201).json({ 
            mensagem: "Alocação registrada com sucesso!", 
            alocacao_id: Number(result.insertId) 
        });

    } catch (err) {
        if (conn) await conn.rollback(); // Se algo der errado, desfaz tudo
        res.status(500).json({ error: "Erro ao registrar alocação: " + err.message });
    } finally {
        if (conn) conn.end();
    }
});

// PUT: Finalizar alocação - Devolução do Veículo
router.put('/:id/devolucao', async (req, res) => {
    let conn;
    try {
        const { id } = req.params; // Pega o ID da alocação que está na URL
        const { data_retorno, km_final } = req.body; // Dados que o usuário vai digitar

        conn = await pool.getConnection();

        await conn.beginTransaction();

        // Descobre qual foi o veículo 
        const rows = await conn.query("SELECT veiculo_id FROM alocacoes WHERE id = ?", [id]);
        
        if (rows.length === 0) {
            await conn.rollback();
            return res.status(404).json({ error: "Alocação não encontrada." });
        }
        
        const veiculo_id = rows[0].veiculo_id;

        // Preenche data de retorno e km final
        const queryAlocacao = "UPDATE alocacoes SET data_retorno = ?, km_final = ? WHERE id = ?";
        await conn.query(queryAlocacao, [data_retorno, km_final, id]);

        // Mudar o status do veículo de volta para 'D' Disponível
        const queryVeiculo = "UPDATE veiculos SET status = 'D' WHERE id = ?";
        await conn.query(queryVeiculo, [veiculo_id]);

        // ok
        await conn.commit();

        res.json({ mensagem: "Veículo devolvido com sucesso! Status alterado para 'D'." });

    } catch (err) {
        if (conn) await conn.rollback(); // Desfaz tudo se der erro
        res.status(500).json({ error: "Erro ao registrar devolução: " + err.message });
    } finally {
        if (conn) conn.end();
    }
});



module.exports = router;