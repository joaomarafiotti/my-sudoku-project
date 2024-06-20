function isValid4x4Solution(board) {
    for (let i = 0; i < 4; i++) {
        const rowSet = new Set();
        const colSet = new Set();
        for (let j = 0; j < 4; j++) {
            const cellValueRow = board[i][j];
            const cellValueCol = board[j][i];
            if (cellValueRow === 0 || cellValueRow < 1 || cellValueRow > 4 || rowSet.has(cellValueRow)) {
                return false;
            }
            if (cellValueCol === 0 || cellValueCol < 1 || cellValueCol > 4 || colSet.has(cellValueCol)) {
                return false;
            }
            rowSet.add(cellValueRow);
            colSet.add(cellValueCol);
        }
    }
    return true;
}

function generate4x4SudokuBoard() {
    let board = Array.from({ length: 4 }, () => Array(4).fill(0));

    if (!solve4x4Sudoku(board)) {
        console.error('Failed to generate a valid 4x4 Sudoku board.');
    }

    return board;
}

function create4x4Puzzle(board, emptyCells) {
    let puzzle = JSON.parse(JSON.stringify(board));
    while (emptyCells > 0) {
        let row = Math.floor(Math.random() * 4);
        let col = Math.floor(Math.random() * 4);
        while (puzzle[row][col] === 0) {
            row = Math.floor(Math.random() * 4);
            col = Math.floor(Math.random() * 4);
        }
        puzzle[row][col] = 0;
        emptyCells--;
    }
    return puzzle;
}

function solve4x4Sudoku(board) {
    // Função para encontrar a próxima posição vazia no tabuleiro
    const findEmptyPosition = (board) => {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 0) {
                    return [i, j];
                }
            }
        }
        return null;
    };

    // Função para verificar se é seguro inserir um número na posição atual
    const isSafe = (board, row, col, num) => {
        // Verifica se o número já está presente na linha ou coluna atual
        for (let x = 0; x < 4; x++) {
            if (board[row][x] === num || board[x][col] === num) {
                return false;
            }
        }
        return true;
    };

    // Encontra a próxima posição vazia no tabuleiro
    const emptyPos = findEmptyPosition(board);

    // Se não houver mais posições vazias, o Sudoku está resolvido
    if (!emptyPos) {
        return true;
    }

    // Obtém as coordenadas da próxima posição vazia
    const [row, col] = emptyPos;

    // Tentativa de preencher a posição atual com números de 1 a 4
    for (let num = 1; num <= 4; num++) {
        // Verifica se é seguro inserir o número na posição atual
        if (isSafe(board, row, col, num)) {
            // Preenche a posição com o número atual
            board[row][col] = num;
            // Tenta resolver o restante do tabuleiro recursivamente
            if (solve4x4Sudoku(board)) {
                return true;
            }
            // Se não for possível resolver com esse número, faz o backtracking
            board[row][col] = 0;
        }
    }

    // Retorna false se não houver solução
    return false;
}

module.exports = {
    generate4x4SudokuBoard,
    create4x4Puzzle,
    isValid4x4Solution
};
  