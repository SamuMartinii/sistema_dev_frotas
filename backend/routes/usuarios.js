const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt'); // Importa a biblioteca de segurança

// POST
router.post('/', async (req, res) => {
    let conn;
    try {
        const { nome, email, senha, tipo_usuario, telefone, rg, cnh, validade_cnh } = req.body;

        // Criptografa da senha
        const saltRounds = 10;
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);
        
        conn = await pool.getConnection();
        
        // Inserção no banco - senha criptografada
        const query = `
            INSERT INTO usuarios 
            (nome, email, senha, tipo_usuario, telefone, rg, cnh, validade_cnh) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const result = await conn.query(query, [
            nome, email, senhaCriptografada, tipo_usuario, telefone, rg, cnh, validade_cnh
        ]);
        
        // OK
        res.status(201).json({ 
            id: Number(result.insertId), 
            nome, 
            email, 
            tipo_usuario,
            mensagem: "Usuário cadastrado com sucesso!"
        });
    } catch (err) {
        // Verificação se o email já existe
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Este email já está cadastrado no sistema." });
        }
        res.status(500).json({ error: "Erro ao cadastrar usuário: " + err.message });
    } finally {
        if (conn) conn.end();
    }
});


// LOGIN - POST
router.post('/login', async (req, res) => {
    let conn;
    try {
        const { email, senha } = req.body;
        
        conn = await pool.getConnection();
        
        // Busca o usuário pelo email
        const rows = await conn.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: "Email ou senha incorretos." });
        }
        
        const usuario = rows[0];
        
        // Pede pro bcrypt comparar a senha em texto com o hash do banco
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) {
            return res.status(401).json({ error: "Email ou senha incorretos." });
        }
        
        // OK
        res.status(200).json({ 
            mensagem: "Login realizado com sucesso!",
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo_usuario: usuario.tipo_usuario
            }
        });
        
    } catch (err) {
        res.status(500).json({ error: "Erro interno ao tentar fazer login." });
    } finally {
        if (conn) conn.end();
    }
});


module.exports = router;