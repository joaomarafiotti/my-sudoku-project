import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        navigate('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao registrar usuário.');
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao registrar usuário. Verifique sua conexão.');
    }
  };

  return (
    <div className="register-container"> {}
      <h2 style={{ textAlign: 'center' }}>Cadastrar</h2>
      <form id="register-form" className="register-form" onSubmit={handleSubmit}>
        <div>
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
        <button type="submit" className="register-button">Criar Conta</button>
      </form>
      <p className="register-login-link">
        Já tem uma conta? <a href="/login">Faça login</a>
      </p>
    </div>
  );
};

export default Register;
