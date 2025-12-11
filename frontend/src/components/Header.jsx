import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for user on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Listen for storage changes (e.g., login/logout from another tab)
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom event for same-tab updates
    const handleUserChange = () => {
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('userChanged', handleUserChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userChanged', handleUserChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('userChanged'));
    navigate('/');
  };

  return (
    <header>
      <h1>
        <Link to={user ? "/dashboard" : "/"}>MatchMaker</Link>
      </h1>
      <nav>
        {user ? (
          <>
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
            <Link to="/browse" className={location.pathname === '/browse' ? 'active' : ''}>Browse Games</Link>
            <Link to="/create" className={location.pathname === '/create' ? 'active' : ''}>Create Game</Link>
            <Link to="/my-games" className={location.pathname === '/my-games' ? 'active' : ''}>My Games</Link>
            <button onClick={handleLogout} style={{background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit', padding: 0}}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
            <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>
            <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
