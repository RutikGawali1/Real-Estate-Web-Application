// File: src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from '././pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  return (
    <Router>
      <nav className="bg-gray-800 text-white p-4 flex justify-between">
        <div className="text-lg font-bold">Real Estate App</div>
        <div className="flex gap-4">
          <Link to="/" className="hover:underline">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/';
                }}
                className="hover:underline"
              >Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;