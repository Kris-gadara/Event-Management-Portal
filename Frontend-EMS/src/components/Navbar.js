import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, LogOut, User } from 'lucide-react';

const Navbar = ({ role, navItems }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="dashboard-navbar">
        <div className="navbar-container">
          <Link to={`/${role}`} className="navbar-brand">
            <div className="brand-icon">
              <GraduationCap size={24} strokeWidth={2.5} />
            </div>
            <span className="brand-text">Event Management System</span>
          </Link>
          
          <ul className="navbar-nav">
            {navItems && navItems.map((item, index) => (
              <li key={index}>
                <Link to={item.path} className="nav-link">
                  {item.icon && <span className="nav-icon">{item.icon}</span>}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="navbar-right">
            {user && (
              <div className="user-profile">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    <User size={18} />
                  </div>
                )}
                <span className="user-name">{user.name}</span>
              </div>
            )}
            
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
      
      <style>{styles}</style>
    </>
  );
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  
  .dashboard-navbar {
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    padding: 0 24px;
    height: 70px;
    display: flex;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 4px 20px rgba(30, 64, 175, 0.25);
    font-family: 'DM Sans', -apple-system, sans-serif;
  }
  
  .navbar-container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
  }
  
  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    flex-shrink: 0;
  }
  
  .brand-icon {
    width: 42px;
    height: 42px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.3s ease;
  }
  
  .navbar-brand:hover .brand-icon {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
  }
  
  .brand-text {
    font-size: 18px;
    font-weight: 700;
    color: white;
    font-family: 'Outfit', sans-serif;
  }
  
  .navbar-nav {
    display: flex;
    align-items: center;
    gap: 8px;
    list-style: none;
    margin: 0;
    padding: 0;
    flex: 1;
    justify-content: center;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    border-radius: 10px;
    transition: all 0.3s ease;
  }
  
  .nav-link:hover {
    color: white;
    background: rgba(255, 255, 255, 0.15);
  }
  
  .nav-link.active {
    color: white;
    background: rgba(255, 255, 255, 0.2);
  }
  
  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .navbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
  }
  
  .user-profile {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 50px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.5);
  }
  
  .user-avatar-placeholder {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.5);
  }
  
  .user-name {
    color: white;
    font-size: 14px;
    font-weight: 600;
  }
  
  .logout-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'DM Sans', sans-serif;
  }
  
  .logout-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-1px);
  }
  
  /* Responsive */
  @media (max-width: 1024px) {
    .brand-text {
      display: none;
    }
    
    .navbar-nav {
      gap: 4px;
    }
    
    .nav-link {
      padding: 10px 14px;
      font-size: 13px;
    }
  }
  
  @media (max-width: 768px) {
    .dashboard-navbar {
      padding: 0 16px;
      height: 64px;
    }
    
    .navbar-container {
      gap: 16px;
    }
    
    .user-name {
      display: none;
    }
    
    .user-profile {
      padding: 6px;
    }
    
    .logout-btn span {
      display: none;
    }
    
    .logout-btn {
      padding: 10px;
    }
  }
`;

export default Navbar;
