import React, { useState, useEffect } from 'react';

const SudokuBoard = ({ board, difficulty }) => {
  const [gridSize, setGridSize] = useState(9);
  const [userInput, setUserInput] = useState(
    Array.from({ length: board.length }, () => Array(board.length).fill(''))
  );

  useEffect(() => {
    setGridSize(difficulty === 'easy' ? 4 : 9);
    setUserInput(Array.from({ length: board.length }, () => Array(board.length).fill('')));
  }, [board, difficulty]);

  const handleInputChange = (rowIndex, colIndex, value) => {
    setUserInput((prevInput) => {
      const newInput = [...prevInput];
      newInput[rowIndex][colIndex] = value;
      onInputChange(newInput); // Chame a função onInputChange para atualizar o estado no SudokuGame
      return newInput;
    });
  };
  
  return (
    <div className={`board ${gridSize === 4 ? 'four-by-four' : 'nine-by-nine'}`}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((value, colIndex) => (
            <div key={colIndex} className="cell">
              {value !== 0 ? value : (
                <input
                  type="text"
                  maxLength="1"
                  value={userInput[rowIndex][colIndex]}
                  onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SudokuBoard;
