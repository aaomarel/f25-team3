import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const errorText = await response.text();
        setError(errorText || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Registration error:', err);
    }
  };

  return (
    <main>
      <h2>✨ Sign Up</h2>
      {error && <p style={{ color: 'var(--danger)', textAlign: 'center', padding: '1rem', background: 'rgba(214, 48, 49, 0.1)', borderRadius: 'var(--radius)', fontWeight: '600' }}>{error}</p>}
      {success && <p style={{ color: 'var(--success)', textAlign: 'center', padding: '1rem', background: 'rgba(0, 184, 148, 0.1)', borderRadius: 'var(--radius)', fontWeight: '600' }}>Registration successful! Redirecting to login...</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input 
          type="text" 
          id="username" 
          name="username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required 
        />
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit">Sign Up</button>
      </form>
    </main>
  );
};

export default SignUp;
