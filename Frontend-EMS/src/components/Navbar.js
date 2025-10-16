import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ role, navItems }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to={`/${role}`} className="navbar-brand">
          Event Management System
        </Link>
        <ul className="navbar-nav">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link to={item.path} className="nav-link">
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <span className="nav-link" style={{ cursor: 'default' }}>
              Welcome, {user?.name}
            </span>
          </li>
          <li>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
