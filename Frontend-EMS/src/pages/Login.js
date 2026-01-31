import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Mail, Lock, Eye, EyeOff, GraduationCap, ArrowRight, Sparkles, Calendar, Users, Trophy } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      showSuccess('Login successful! Redirecting...');
      switch (result.user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'faculty':
          navigate('/faculty');
          break;
        case 'coordinator':
          navigate('/coordinator');
          break;
        case 'student':
          navigate('/student');
          break;
        default:
          navigate('/');
      }
    } else {
      showError(result.message || 'Login failed. Please check your credentials.');
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      {/* Left Side - Decorative */}
      <div className="login-left">
        <div className="login-left-content">
          <Link to="/" className="login-logo">
            <div className="logo-icon-wrapper">
              <GraduationCap size={32} strokeWidth={2.5} />
            </div>
            <span className="logo-text">Event Management System</span>
          </Link>
          
          <div className="login-welcome">
            <h1>Welcome Back!</h1>
            <p>Sign in to access your dashboard and explore amazing campus events and vibrant communities.</p>
          </div>
          
          <div className="login-features">
            <div className="feature-item">
              <div className="feature-icon"><Calendar size={20} /></div>
              <span>Access upcoming events</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><Users size={20} /></div>
              <span>Join student clubs</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><Trophy size={20} /></div>
              <span>Earn certificates</span>
            </div>
          </div>
        </div>
        
        <div className="login-decorations">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="login-container">
          <div className="login-header">
            <div className="login-icon">
              <Sparkles size={24} />
            </div>
            <h2>Sign In</h2>
            <p>Enter your credentials to continue</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/login" className="forgot-password">Forgot Password?</Link>
            </div>
            
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <span className="loading-text">Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
          
          <div className="login-divider">
            <span>or</span>
          </div>
          
          <p className="login-register">
            Don't have an account? <Link to="/register">Register as Student</Link>
          </p>
        </div>
      </div>

      <style>{styles}</style>
    </div>
  );
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  
  .login-page {
    display: flex;
    min-height: 100vh;
    font-family: 'DM Sans', -apple-system, sans-serif;
  }
  
  /* Left Side */
  .login-left {
    flex: 1;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    padding: 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }
  
  .login-left-content {
    position: relative;
    z-index: 1;
  }
  
  .login-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    margin-bottom: 80px;
  }
  
  .login-logo .logo-icon-wrapper {
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .login-logo .logo-text {
    font-size: 20px;
    font-weight: 700;
    color: white;
    font-family: 'Outfit', sans-serif;
  }
  
  .login-welcome {
    margin-bottom: 60px;
  }
  
  .login-welcome h1 {
    font-size: 48px;
    font-weight: 800;
    color: white;
    margin-bottom: 16px;
    font-family: 'Outfit', sans-serif;
    letter-spacing: -1px;
  }
  
  .login-welcome p {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.6;
    max-width: 400px;
  }
  
  .login-features {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: white;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .feature-item:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(5px);
  }
  
  .feature-icon {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .login-decorations {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }
  
  .decoration-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
  }
  
  .circle-1 {
    width: 400px;
    height: 400px;
    top: -150px;
    right: -150px;
  }
  
  .circle-2 {
    width: 300px;
    height: 300px;
    bottom: -100px;
    left: -100px;
  }
  
  .circle-3 {
    width: 200px;
    height: 200px;
    bottom: 20%;
    right: 10%;
    background: rgba(255, 255, 255, 0.08);
  }
  
  /* Right Side */
  .login-right {
    flex: 1;
    background: #f8fafc;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
  }
  
  .login-container {
    width: 100%;
    max-width: 440px;
    background: white;
    padding: 48px;
    border-radius: 24px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }
  
  .login-header {
    text-align: center;
    margin-bottom: 36px;
  }
  
  .login-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin: 0 auto 20px;
    box-shadow: 0 4px 16px rgba(30, 64, 175, 0.3);
  }
  
  .login-header h2 {
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
    font-family: 'Outfit', sans-serif;
  }
  
  .login-header p {
    font-size: 15px;
    color: #64748b;
  }
  
  .login-form .form-group {
    margin-bottom: 24px;
  }
  
  .login-form label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #334155;
    margin-bottom: 8px;
  }
  
  .input-wrapper {
    position: relative;
  }
  
  .input-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
  }
  
  .login-form input[type="email"],
  .login-form input[type="password"],
  .login-form input[type="text"] {
    width: 100%;
    padding: 14px 16px 14px 48px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 15px;
    color: #0f172a;
    transition: all 0.3s ease;
    background: #f8fafc;
    font-family: 'DM Sans', sans-serif;
  }
  
  .login-form input:focus {
    outline: none;
    border-color: #1e40af;
    background: white;
    box-shadow: 0 0 0 4px rgba(30, 64, 175, 0.1);
  }
  
  .login-form input::placeholder {
    color: #94a3b8;
  }
  
  .password-toggle {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s ease;
  }
  
  .password-toggle:hover {
    color: #1e40af;
  }
  
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
  }
  
  .remember-me {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
    color: #64748b;
  }
  
  .remember-me input[type="checkbox"] {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    accent-color: #1e40af;
  }
  
  .forgot-password {
    font-size: 14px;
    color: #1e40af;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
  }
  
  .forgot-password:hover {
    color: #0ea5e9;
  }
  
  .login-btn {
    width: 100%;
    padding: 16px 24px;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(30, 64, 175, 0.3);
    font-family: 'DM Sans', sans-serif;
    margin: 0;
  }
  
  .login-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(30, 64, 175, 0.4);
  }
  
  .login-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .login-btn svg {
    transition: transform 0.3s ease;
  }
  
  .login-btn:hover:not(:disabled) svg {
    transform: translateX(4px);
  }
  
  .loading-text {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  
  .login-divider {
    display: flex;
    align-items: center;
    margin: 28px 0;
  }
  
  .login-divider::before,
  .login-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
  
  .login-divider span {
    padding: 0 16px;
    color: #94a3b8;
    font-size: 14px;
    font-weight: 500;
  }
  
  .login-register {
    text-align: center;
    font-size: 15px;
    color: #64748b;
    margin: 0;
  }
  
  .login-register a {
    color: #1e40af;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .login-register a:hover {
    color: #0ea5e9;
  }
  
  /* Responsive */
  @media (max-width: 1024px) {
    .login-left {
      display: none;
    }
    
    .login-right {
      padding: 24px;
    }
    
    .login-container {
      padding: 32px;
    }
  }
  
  @media (max-width: 480px) {
    .login-right {
      padding: 16px;
    }
    
    .login-container {
      padding: 24px;
      border-radius: 20px;
    }
    
    .login-header h2 {
      font-size: 24px;
    }
    
    .form-options {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }
  }
`;

export default Login;
