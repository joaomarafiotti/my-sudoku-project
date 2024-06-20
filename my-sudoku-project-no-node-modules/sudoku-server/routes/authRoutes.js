const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/register', authController.registerUser);

router.post('/login', authController.loginUser);

router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Rota protegida acessada com sucesso.', userId: req.userId });
});

module.exports = router;
