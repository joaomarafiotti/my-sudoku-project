const db = require('../config/db');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(path.join(__dirname, '..', 'chaves', 'private.key'), 'utf8');
const publicKey = fs.readFileSync(path.join(__dirname, '..', 'chaves', 'public.key'), 'utf8');

function generateToken(payload) {
  return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '1h' });
}

const registerUser = (req, res) => {
  const { username, password } = req.body;

  const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
  db.get(checkUserQuery, [username], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao verificar usuário existente.' });
    }

    if (row) {
      return res.status(409).json({ message: 'Usuário já existe.' });
    }

    const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.run(insertUserQuery, [username, password], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao registrar usuário.' });
      }
      const token = generateToken({ id: this.lastID });
      res.status(201).json({ auth: true, token }); 
    });
  });
};

const loginUser = (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.get(query, [username, password], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer login.' });
    }
    if (!row) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }
    const token = generateToken({ id: row.id });
    res.status(200).json({ auth: true, token });
  });
};

module.exports = {
  registerUser,
  loginUser,
};
