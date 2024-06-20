const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');
const db = require('./config/db');
const sudokuRoutes = require('./routes/sudokuRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', authRoutes); 
app.use('/sudoku', sudokuRoutes); // Use as rotas de sudoku

app.use(express.static(path.join(__dirname, '../sudoku-client/build')));

const privateKey = fs.readFileSync(path.join(__dirname, 'chaves', 'private.key'), 'utf8');
const publicKey = fs.readFileSync(path.join(__dirname, 'chaves', 'public.key'), 'utf8');

function generateToken(payload) {
    return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '1h' });
}

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

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
    db.run(query, [email, password], function (err) {
        if (err) {
            return res.status(500).send({ message: 'Error registering user.' });
        }
        const token = generateToken({ id: this.lastID });
        res.status(200).send({ auth: true, token });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
    db.get(query, [email, password], (err, row) => {
        if (err) {
            return res.status(500).send({ message: 'Error logging in user.' });
        }
        if (!row) {
            return res.status(404).send({ message: 'User not found.' });
        }
        const token = generateToken({ id: row.id });
        res.status(200).send({ auth: true, token });
    });
});

app.post('/sudoku/validate', verifyToken, (req, res) => {
  const { board } = req.body;
  const isValid = isValidSolution(board);
  res.json({ valid: isValid });
});

app.get('/sudoku4x4', verifyToken, (req, res) => {
    const fullBoard = generate4x4SudokuBoard();
    const puzzleBoard = create4x4Puzzle(fullBoard, 5);
    res.send({ board: puzzleBoard });
});

app.get('/sudoku9x9', verifyToken, (req, res) => {
    const fullBoard = generateSudokuBoard();
    const puzzleBoard = createPuzzle(fullBoard, 40);
    res.send({ board: puzzleBoard });
});

app.get('/decode-token', verifyToken, (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; 
    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token inválido.' });
      }
      res.json(decoded); 
    });
});  

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../sudoku-client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
