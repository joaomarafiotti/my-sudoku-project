import React, { useEffect, useState } from 'react';
import SudokuBoard from './SudokuBoard';
import axios from 'axios';

const SudokuGame = () => {
  const [difficulty, setDifficulty] = useState('normal');
  const [board, setBoard] = useState([]);
  const [isValid, setIsValid] = useState(null);
  const [userInput, setUserInput] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para indicar se o tabuleiro está carregando
  const [error, setError] = useState(null); // Estado para armazenar mensagens de erro

  useEffect(() => {
    const fetchBoard = async () => {
      setIsLoading(true); // Inicia o carregamento
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/sudoku/${difficulty === 'normal' ? '9x9' : '4x4'}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBoard(response.data.board);
        setUserInput(Array.from({ length: response.data.board.length }, () => Array(response.data.board.length).fill('')));
        setIsValid(null); // Reinicia a validação
      } catch (error) {
        console.error('Erro ao buscar o tabuleiro:', error);
        setError('Erro ao buscar o tabuleiro. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false); // Finaliza o carregamento
      }
    };

    fetchBoard();
  }, [difficulty]); // Executa quando a dificuldade muda

  const checkSolution = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/sudoku/validate', { board: userInput }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsValid(response.data.valid);
    } catch (error) {
      console.error('Erro ao validar a solução:', error);
      setError('Erro ao validar a solução. Tente novamente mais tarde.');
    }
  };

  const resetGame = () => {
    setDifficulty('normal'); // Reinicia a dificuldade para 'normal'
    setIsValid(null); // Reinicia a validação
  };

  return (
    <div>
      <h1>Sudoku Game</h1>

      {isLoading ? ( // Exibe uma mensagem de carregamento enquanto o tabuleiro não está pronto
        <p>Carregando...</p>
      ) : error ? ( // Exibe a mensagem de erro se houver algum problema
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <SudokuBoard board={board} difficulty={difficulty} onInputChange={setUserInput} />
          <button onClick={() => setDifficulty(difficulty === 'normal' ? 'easy' : 'normal')}>
            Mudar Dificuldade
          </button>
          <button onClick={checkSolution}>Validar</button>
          <button onClick={resetGame}>Reiniciar</button> {/* Botão para reiniciar o jogo */}
          {isValid !== null && (
            <p style={{ color: isValid ? 'green' : 'red' }}>
              {isValid ? 'Solução correta!' : 'Solução incorreta.'}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default SudokuGame;
