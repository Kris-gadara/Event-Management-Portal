import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ role, navItems }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Debug: Log user data to check image field
  React.useEffect(() => {
    if (user) {
      console.log('Navbar - User data:', user);
      console.log('Navbar - User image:', user.image);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to={`/${role}`} className="navbar-brand">
          🎓 Event Management System
        </Link>
        <ul className="navbar-nav">
          {navItems && navItems.map((item, index) => (
            <li key={index}>
              <Link to={item.path} className="nav-link">
                {item.label}
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <div className="nav-user-profile" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: 'var(--space-sm) var(--space-md)',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '30px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'default'
              }}>
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    style={{
                      width: '35px',
                      height: '35px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid rgba(255, 255, 255, 0.5)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '35px',
                    height: '35px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--success-gradient-start), var(--success-gradient-end))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span style={{
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                }}>
                  {user.name}
                </span>
              </div>
            </li>
          )}
          <li>
            <button onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
