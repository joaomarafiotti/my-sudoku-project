function isValidSolution(board) {
    for (let i = 0; i < 9; i++) {
        const rowSet = new Set();
        const colSet = new Set();
        const regionSet = new Set();
        for (let j = 0; j < 9; j++) {
            const cellValueRow = board[i][j];
            const cellValueCol = board[j][i];
            const startRow = Math.floor(i / 3) * 3;
            const startCol = (i % 3) * 3;
            const cellValueRegion = board[startRow + Math.floor(j / 3)][startCol + (j % 3)];
            if (cellValueRow === 0 || cellValueRow < 1 || cellValueRow > 9 || rowSet.has(cellValueRow)) {
                return false;
            }
            if (cellValueCol === 0 || cellValueCol < 1 || cellValueCol > 9 || colSet.has(cellValueCol)) {
                return false;
            }
            if (cellValueRegion === 0 || cellValueRegion < 1 || cellValueRegion > 9 || regionSet.has(cellValueRegion)) {
                return false;
            }
            rowSet.add(cellValueRow);
            colSet.add(cellValueCol);
            regionSet.add(cellValueRegion);
        }
    }
    return true;
}

function generateSudokuBoard() {
    let board = Array.from({ length: 9 }, () => Array(9).fill(0));

    if (!solveSudoku(board)) {
        console.error('Failed to generate a valid Sudoku board.');
    }

    return board;
}

function createPuzzle(board, emptyCells) {
    let puzzle = JSON.parse(JSON.stringify(board));
    while (emptyCells > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        while (puzzle[row][col] === 0) {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        }
        puzzle[row][col] = 0;
        emptyCells--;
    }
    return puzzle;
}

function solveSudoku(board) {
    let emptyPos = findEmptyPosition(board);
    if (!emptyPos) {
        return true;
    }
    let [row, col] = emptyPos;

    for (let num = 1; num <= 9; num++) {
        if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
                return true;
            }
            board[row][col] = 0; // Backtracking
        }
    }
    return false;
}

function isSafe(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num) {
            return false;
        }
    }
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) {
                return false;
            }
        }
    }
    return true;
}

function findEmptyPosition(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                return [i, j];
            }
        }
    }
    return null;
}

module.exports = {
    generateSudokuBoard,
    createPuzzle,
    isValidSolution
};
  