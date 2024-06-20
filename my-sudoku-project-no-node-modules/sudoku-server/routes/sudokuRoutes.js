const express = require('express');
const router = express.Router();
const sudokuController = require('../controllers/sudokuController');
const verifyToken = require('../middleware/authMiddleware');

// Rota para gerar um novo tabuleiro de Sudoku 9x9 (protegida por token)
router.get('/9x9', verifyToken, sudokuController.generateSudoku9x9);

// Rota para gerar um novo tabuleiro de Sudoku 4x4 (protegida por token)
router.get('/4x4', verifyToken, sudokuController.generateSudoku4x4);

module.exports = router;
