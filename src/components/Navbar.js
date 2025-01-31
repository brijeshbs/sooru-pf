import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = false; // This should come from your auth context

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-logo">
          <span className="logo-text">Sooru</span>
          <span className="logo-subtitle"> Prototype</span>
        </Link>

        <div className="nav-links">
          {isLoggedIn ? (
            <>
              <Link to="/projects" className="nav-link">My Playgrounds</Link>
              <button className="nav-button logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/playground/demo" className="nav-link">Try Demo</Link>
              <Link to="/auth" className="nav-button login">Login</Link>
              <Link to="/auth" className="nav-button register">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;