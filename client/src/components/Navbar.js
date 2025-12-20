import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing user data:', err);
        setUser(null);
      }
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <span>📚 BookNest</span>
        </Link>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <div className="navbar-links">
            <Link to="/" onClick={closeMobileMenu}>Home</Link>
            <Link to="/explore" onClick={closeMobileMenu}>Explore Books</Link>
          </div>

          <div className="navbar-actions">
            {!user ? (
              <>
                <Link to="/login" className="nav-btn login-btn" onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link to="/register" className="nav-btn register-btn" onClick={closeMobileMenu}>
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/cart" className="nav-icon-btn" onClick={closeMobileMenu}>
                  <ShoppingCart size={20} />
                  <span className="mobile-label">Cart</span>
                </Link>
                <Link to="/profile" className="nav-icon-btn" onClick={closeMobileMenu}>
                  <User size={20} />
                  <span className="mobile-label">Profile</span>
                </Link>
                <div className="navbar-user">
                  <span className="user-greeting">Hi, {user.username}</span>
                  <Link to="/" className='logout' onClick={handleLogout}>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;