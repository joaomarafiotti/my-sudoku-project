const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Carregar chaves
const privateKey = fs.readFileSync(path.join(__dirname, '..', 'chaves', 'private.key'), 'utf8');
const publicKey = fs.readFileSync(path.join(__dirname, '..', 'chaves', 'public.key'), 'utf8');

// Middleware para verificar tokens JWT
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id;
    next();
  });
}

module.exports = verifyToken;
