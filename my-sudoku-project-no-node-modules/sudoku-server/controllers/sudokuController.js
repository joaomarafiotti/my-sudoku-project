const { generateSudokuBoard, createPuzzle } = require('../../sudoku-client/src/components/logic/Sudoku_9x9'); 

// Controller para gerar um novo tabuleiro de Sudoku 9x9
const generateSudoku9x9 = (req, res) => {
  const fullBoard = generateSudokuBoard();
  const puzzleBoard = createPuzzle(fullBoard, 40); // Ajuste a dificuldade aqui
  res.json({ board: puzzleBoard });
};

// Controller para gerar um novo tabuleiro de Sudoku 4x4
const generateSudoku4x4 = (req, res) => {
  const fullBoard = generate4x4SudokuBoard();
  const puzzleBoard = create4x4Puzzle(fullBoard, 5); // Ajuste a dificuldade aqui
  res.json({ board: puzzleBoard });
};

module.exports = {
  generateSudoku9x9,
  generateSudoku4x4
};
