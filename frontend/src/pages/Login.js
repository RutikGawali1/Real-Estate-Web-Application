import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // <-- use this to redirect

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        identifier,
        password,
      });

      // Save token to local storage
      localStorage.setItem('token', res.data.token);

      setMessage('Login successful!');
      setTimeout(() => {
        window.location.href = '/dashboard'; // force reload
      }, 500);

    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {message && <p className="mb-2 text-blue-600">{message}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Email or Username"
          className="w-full p-2 border rounded"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
