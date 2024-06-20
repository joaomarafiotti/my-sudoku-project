import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        navigate('/sudoku');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao fazer login. Verifique suas credenciais.');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao fazer login. Verifique sua conexão.');
    }
  };

  return (
    <div className="login-container"> {}
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      <form id="login-form" className="login-form" onSubmit={handleSubmit}>
        <div> {}
          <label htmlFor="username-input">Usuário:</label>
          <input
            type="text"
            id="username-input"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password-input">Senha:</label>
          <input
            type="password"
            id="password-input"
            placeholder="senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className="login-button">Login</button>
      </form>
      <p className="login-register-link">
        Ainda não tem uma conta? <a href="/register">Cadastre-se</a>
      </p>
    </div>
  );
};

export default Login;
