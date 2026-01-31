import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    fetchData();
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, clubsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/public/events'),
        axios.get('http://localhost:5000/api/public/clubs')
      ]);
      setEvents(eventsRes.data);
      setClubs(clubsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // Sample events for preview when empty
  const sampleEvents = [
    { _id: '1', name: 'Spoural 2025', description: 'The grand annual sports festival featuring inter-college competitions, athletic events, and team sports.', date: '2025-03-15', time: '9:00 AM', venue: 'Sports Complex', category: 'Sports' },
    { _id: '2', name: 'Cognizance', description: 'The flagship technical festival showcasing innovation, hackathons, and cutting-edge technology workshops.', date: '2025-03-20', time: '10:00 AM', venue: 'Tech Hub', category: 'Technical' },
    { _id: '3', name: 'Concerts Night', description: 'An electrifying evening of live music performances featuring popular bands and artists.', date: '2025-03-25', time: '6:00 PM', venue: 'Open Air Amphitheatre', category: 'Cultural' }
  ];

  // Sample clubs for preview when empty
  const sampleClubs = [
    { _id: '1', name: 'Coding Club', description: 'Learn programming and build amazing projects', category: 'Tech', members: 156 },
    { _id: '2', name: 'Photography Society', description: 'Capture moments and master visual storytelling', category: 'Arts', members: 89 },
    { _id: '3', name: 'Debate Union', description: 'Sharpen your critical thinking and public speaking', category: 'Academic', members: 67 },
    { _id: '4', name: 'Sports Club', description: 'Stay fit and compete in various sports events', category: 'Sports', members: 234 }
  ];

  const features = [
    { icon: '⚡', title: 'Easy Registration', description: 'One-click event sign-ups with instant confirmation' },
    { icon: '📅', title: 'Smart Calendar', description: 'Sync events directly to your personal calendar' },
    { icon: '🎯', title: 'Club Management', description: 'Organize and manage your club activities seamlessly' },
    { icon: '🔔', title: 'Smart Notifications', description: 'Never miss an event with timely reminders' },
    { icon: '🏆', title: 'Certificates', description: 'Earn digital certificates for participation' },
    { icon: '🤝', title: 'Networking', description: 'Connect with like-minded students and mentors' }
  ];

  const displayEvents = events.length > 0 ? events.slice(0, 3) : sampleEvents;
  const displayClubs = clubs.length > 0 ? clubs.slice(0, 4) : sampleClubs;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner" />
          <p>Loading amazing events...</p>
        </div>
        <style>{loadingStyles}</style>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Floating Background Elements */}
      <div className="bg-elements">
        <div className="floating-shape shape-1" />
        <div className="floating-shape shape-2" />
        <div className="floating-shape shape-3" />
        <div className="floating-shape shape-4" />
        <div className="grid-pattern" />
      </div>

      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">Event Management System</span>
          </Link>
          <div className="nav-actions">
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register as Student
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient" />
          <div className="hero-shapes">
            <div className="hero-circle hero-circle-1" />
            <div className="hero-circle hero-circle-2" />
            <div className="hero-circle hero-circle-3" />
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>Welcome to Campus Life</span>
          </div>
          <h1 className="hero-title">
            <span className="title-line">Discover Amazing</span>
            <span className="title-line title-highlight">Events & Clubs</span>
          </h1>
          <p className="hero-subtitle">
            Your gateway to unforgettable experiences, vibrant communities, 
            and endless opportunities at our campus.
          </p>
          <div className="hero-cta">
            <Link to="/login" className="btn btn-cta">
              <span>Get Started</span>
              <span className="cta-arrow">→</span>
            </Link>
            <Link to="/register" className="btn btn-secondary">
              <span>Create Account</span>
            </Link>
          </div>

        </div>
        <div className="hero-visual">
          <div className="visual-card visual-card-1">
            <div className="card-icon">🎉</div>
            <span>Tech Summit</span>
          </div>
          <div className="visual-card visual-card-2">
            <div className="card-icon">🎭</div>
            <span>Cultural Fest</span>
          </div>
          <div className="visual-card visual-card-3">
            <div className="card-icon">🏆</div>
            <span>Sports Meet</span>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="section events-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-title-group">
              <span className="section-icon">🎉</span>
              <h2 className="section-title">Upcoming Events</h2>
            </div>
            <Link to="/login" className="view-all-link">
              View All Events
              <span>→</span>
            </Link>
          </div>
          
          <div className="events-grid">
            {displayEvents.map((event, index) => (
              <div key={event._id} className="event-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="event-image">
                  {event.image ? (
                    <img src={event.image} alt={event.name} />
                  ) : (
                    <div className="event-placeholder">
                      <span className="placeholder-icon">📅</span>
                    </div>
                  )}
                  <div className="event-overlay" />
                  <div className="event-date-badge">
                    <span className="date-day">{new Date(event.date).getDate()}</span>
                    <span className="date-month">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  {event.category && (
                    <span className="event-category">{event.category}</span>
                  )}
                </div>
                <div className="event-content">
                  <h3 className="event-title">{event.name}</h3>
                  <p className="event-description">
                    {event.description?.substring(0, 80)}...
                  </p>
                  <div className="event-meta">
                    <span className="meta-item">
                      <span className="meta-icon">🕐</span>
                      {event.time}
                    </span>
                    <span className="meta-item">
                      <span className="meta-icon">📍</span>
                      {event.venue}
                    </span>
                  </div>
                  <Link to="/login" className="event-btn">
                    Register Now
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {events.length === 0 && (
            <p className="sample-notice">
              ✨ Sample events shown for preview. Real events will appear here!
            </p>
          )}
        </div>
      </section>

      {/* Clubs Section */}
      <section className="section clubs-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-title-group">
              <span className="section-icon">🎭</span>
              <h2 className="section-title">Our Clubs</h2>
            </div>
            <Link to="/login" className="view-all-link">
              Explore All Clubs
              <span>→</span>
            </Link>
          </div>
          
          <div className="clubs-grid">
            {displayClubs.map((club, index) => (
              <div key={club._id} className="club-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="club-header">
                  {club.image ? (
                    <img src={club.image} alt={club.name} className="club-image" />
                  ) : (
                    <div className="club-avatar">
                      {club.name.charAt(0)}
                    </div>
                  )}
                  {club.category && (
                    <span className="club-category">{club.category}</span>
                  )}
                </div>
                <div className="club-content">
                  <h3 className="club-name">{club.name}</h3>
                  <p className="club-description">{club.description}</p>
                  {club.members && (
                    <div className="club-members">
                      <span className="members-icon">👥</span>
                      <span>{club.members} members</span>
                    </div>
                  )}
                  <Link to="/login" className="club-btn">
                    Join Club
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {clubs.length === 0 && (
            <p className="sample-notice">
              ✨ Sample clubs shown for preview. Real clubs will appear here!
            </p>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="section-container">
          <div className="features-header">
            <span className="section-icon">🚀</span>
            <h2 className="section-title">Why Choose EventHub?</h2>
            <p className="features-subtitle">
              Everything you need to make the most of your campus experience
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-bg">
          <div className="cta-shape cta-shape-1" />
          <div className="cta-shape cta-shape-2" />
        </div>
        <div className="cta-content">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-subtitle">
            Join thousands of students discovering amazing events and building lifelong connections.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-cta-white">
              Create Free Account
              <span>→</span>
            </Link>
            <Link to="/login" className="btn btn-cta-outline">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <span className="logo-icon">🎓</span>
                <span className="logo-text">Event Management System</span>
              </div>
              <p className="footer-tagline">
                Your gateway to campus life, events, and vibrant student communities.
              </p>
              <div className="social-links">
                <button type="button" className="social-link" aria-label="Facebook">📘</button>
                <button type="button" className="social-link" aria-label="Instagram">📸</button>
                <button type="button" className="social-link" aria-label="Twitter">🐦</button>
                <button type="button" className="social-link" aria-label="LinkedIn">💼</button>
              </div>
            </div>
            
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/login">Events</Link></li>
                <li><Link to="/login">Clubs</Link></li>
                <li><Link to="/login">Calendar</Link></li>
                <li><Link to="/register">Register</Link></li>
              </ul>
            </div>
            
            <div className="footer-links">
              <h4>Support</h4>
              <ul>
                <li><Link to="/login">Help Center</Link></li>
                <li><Link to="/login">Contact Us</Link></li>
                <li><Link to="/login">FAQs</Link></li>
                <li><Link to="/login">Feedback</Link></li>
              </ul>
            </div>
            
            <div className="footer-newsletter">
              <h4>Stay Updated</h4>
              <p>Get notified about new events and updates.</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button type="button">Subscribe</button>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2025 Event Management System. All rights reserved.</p>
            <div className="footer-legal">
              <Link to="/login">Privacy Policy</Link>
              <Link to="/login">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

      <style>{styles}</style>
    </div>
  );
};

const loadingStyles = `
  .loading-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #e0f2fe 100%);
  }
  
  .loading-content {
    text-align: center;
  }
  
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e0f2fe;
    border-top: 4px solid #1e40af;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 16px;
  }
  
  .loading-content p {
    color: #475569;
    font-size: 16px;
    font-family: 'Outfit', sans-serif;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  .home-page {
    font-family: 'Outfit', -apple-system, sans-serif;
    background: linear-gradient(180deg, #f0f9ff 0%, #ffffff 30%, #ffffff 70%, #f0f9ff 100%);
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }
  
  /* Background Elements */
  .bg-elements {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }
  
  .floating-shape {
    position: absolute;
    border-radius: 50%;
    opacity: 0.5;
    animation: float 20s ease-in-out infinite;
  }
  
  .shape-1 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%);
    top: -100px;
    right: -100px;
    animation-delay: 0s;
  }
  
  .shape-2 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(30, 64, 175, 0.06) 0%, transparent 70%);
    bottom: 20%;
    left: -100px;
    animation-delay: -5s;
  }
  
  .shape-3 {
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%);
    top: 40%;
    right: 10%;
    animation-delay: -10s;
  }
  
  .shape-4 {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(30, 64, 175, 0.05) 0%, transparent 70%);
    bottom: -100px;
    right: 20%;
    animation-delay: -15s;
  }
  
  .grid-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(30, 64, 175, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(30, 64, 175, 0.02) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  
  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(30px, -30px) scale(1.05); }
    50% { transform: translate(-20px, 20px) scale(0.95); }
    75% { transform: translate(20px, 30px) scale(1.02); }
  }
  
  /* Navigation */
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 16px 24px;
    transition: all 0.3s ease;
  }
  
  .navbar-scrolled {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
    padding: 12px 24px;
  }
  
  .nav-container {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }
  
  .logo-icon {
    font-size: 28px;
    background: linear-gradient(135deg, #f97316, #fb923c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 2px 4px rgba(249, 115, 22, 0.3));
  }
  
  .logo-text {
    font-size: 20px;
    font-weight: 700;
    background: linear-gradient(135deg, #f97316, #ea580c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
  }
  
  .nav-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  
  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    font-size: 15px;
    font-weight: 600;
    font-family: 'Outfit', sans-serif;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-decoration: none;
    border: none;
  }
  
  .btn-outline {
    background: transparent;
    color: #1e40af;
    border: 2px solid #1e40af;
  }
  
  .btn-outline:hover {
    background: #1e40af;
    color: white;
    transform: translateY(-2px);
  }
  
  .btn-primary {
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3);
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4);
  }
  
  .btn-arrow {
    transition: transform 0.3s ease;
  }
  
  .btn:hover .btn-arrow {
    transform: translateX(4px);
  }
  
  /* Hero Section */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 120px 24px 80px;
    position: relative;
    overflow: hidden;
  }
  
  .hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
  }
  
  .hero-gradient {
    position: absolute;
    top: 0;
    right: 0;
    width: 60%;
    height: 100%;
    background: linear-gradient(135deg, transparent 0%, rgba(14, 165, 233, 0.08) 50%, rgba(30, 64, 175, 0.12) 100%);
    clip-path: polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
  
  .hero-shapes {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  
  .hero-circle {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(30, 64, 175, 0.1);
  }
  
  .hero-circle-1 {
    width: 600px;
    height: 600px;
    top: -200px;
    right: -100px;
    animation: pulse 8s ease-in-out infinite;
  }
  
  .hero-circle-2 {
    width: 400px;
    height: 400px;
    bottom: -100px;
    left: -100px;
    animation: pulse 10s ease-in-out infinite reverse;
  }
  
  .hero-circle-3 {
    width: 200px;
    height: 200px;
    top: 30%;
    right: 20%;
    background: rgba(14, 165, 233, 0.05);
    animation: pulse 6s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }
  
  .hero-content {
    max-width: 1280px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    flex: 1;
  }
  
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(30, 64, 175, 0.08);
    border: 1px solid rgba(30, 64, 175, 0.15);
    border-radius: 50px;
    font-size: 14px;
    color: #1e40af;
    font-weight: 500;
    margin-bottom: 24px;
    animation: fadeInUp 0.6s ease-out;
  }
  
  .badge-icon {
    font-size: 16px;
  }
  
  .hero-title {
    font-size: clamp(40px, 7vw, 80px);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 24px;
    letter-spacing: -2px;
  }
  
  .title-line {
    display: block;
    color: #0f172a;
    animation: fadeInUp 0.6s ease-out;
    animation-fill-mode: both;
  }
  
  .title-line:nth-child(1) { animation-delay: 0.1s; }
  .title-line:nth-child(2) { animation-delay: 0.2s; }
  
  .title-highlight {
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .hero-subtitle {
    font-size: 20px;
    color: #475569;
    line-height: 1.6;
    max-width: 540px;
    margin-bottom: 40px;
    animation: fadeInUp 0.6s ease-out 0.3s both;
  }
  
  .hero-cta {
    display: flex;
    gap: 16px;
    margin-bottom: 60px;
    animation: fadeInUp 0.6s ease-out 0.4s both;
  }
  
  .btn-cta {
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    color: white;
    padding: 16px 32px;
    font-size: 17px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(249, 115, 22, 0.35);
  }
  
  .btn-cta:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(249, 115, 22, 0.45);
  }
  
  .cta-arrow {
    transition: transform 0.3s ease;
    font-size: 18px;
  }
  
  .btn-cta:hover .cta-arrow {
    transform: translateX(5px);
  }
  
  .btn-secondary {
    background: white;
    color: #1e40af;
    border: 2px solid #e2e8f0;
    padding: 14px 28px;
    font-size: 17px;
    border-radius: 12px;
  }
  
  .btn-secondary:hover {
    border-color: #1e40af;
    background: #f8fafc;
    transform: translateY(-3px);
  }
  
  .hero-stats {
    display: flex;
    align-items: center;
    gap: 32px;
    animation: fadeInUp 0.6s ease-out 0.5s both;
  }
  
  .stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .stat-number {
    font-size: 32px;
    font-weight: 800;
    color: #1e40af;
    letter-spacing: -1px;
  }
  
  .stat-label {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
  }
  
  .stat-divider {
    width: 1px;
    height: 40px;
    background: #e2e8f0;
  }
  
  .hero-visual {
    position: absolute;
    right: 5%;
    top: 50%;
    transform: translateY(-50%);
    display: none;
  }
  
  @media (min-width: 1024px) {
    .hero-visual {
      display: block;
    }
  }
  
  .visual-card {
    position: absolute;
    background: white;
    padding: 16px 24px;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
    color: #0f172a;
    animation: floatCard 6s ease-in-out infinite;
  }
  
  .visual-card-1 {
    top: -80px;
    right: 0;
    animation-delay: 0s;
  }
  
  .visual-card-2 {
    top: 40px;
    right: -60px;
    animation-delay: -2s;
  }
  
  .visual-card-3 {
    top: 160px;
    right: 20px;
    animation-delay: -4s;
  }
  
  .card-icon {
    font-size: 28px;
  }
  
  @keyframes floatCard {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Sections */
  .section {
    padding: 100px 24px;
    position: relative;
    z-index: 1;
  }
  
  .section-container {
    max-width: 1280px;
    margin: 0 auto;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 48px;
  }
  
  .section-title-group {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .section-icon {
    font-size: 36px;
  }
  
  .section-title {
    font-size: 36px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -1px;
  }
  
  .view-all-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #1e40af;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .view-all-link:hover {
    gap: 12px;
    color: #0ea5e9;
  }
  
  /* Events Grid */
  .events-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }
  
  .event-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeInUp 0.6s ease-out both;
    border: 1px solid rgba(0, 0, 0, 0.04);
  }
  
  .event-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(30, 64, 175, 0.15);
  }
  
  .event-image {
    position: relative;
    height: 200px;
    overflow: hidden;
  }
  
  .event-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  
  .event-card:hover .event-image img {
    transform: scale(1.08);
  }
  
  .event-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .placeholder-icon {
    font-size: 48px;
    opacity: 0.8;
  }
  
  .event-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.4) 100%);
  }
  
  .event-date-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    background: white;
    padding: 8px 12px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .date-day {
    display: block;
    font-size: 22px;
    font-weight: 800;
    color: #1e40af;
    line-height: 1;
  }
  
  .date-month {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    margin-top: 2px;
  }
  
  .event-category {
    position: absolute;
    bottom: 16px;
    left: 16px;
    background: rgba(255, 255, 255, 0.95);
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    color: #1e40af;
  }
  
  .event-content {
    padding: 24px;
  }
  
  .event-title {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 12px;
    line-height: 1.3;
  }
  
  .event-description {
    font-size: 15px;
    color: #64748b;
    line-height: 1.6;
    margin-bottom: 16px;
  }
  
  .event-meta {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #64748b;
  }
  
  .meta-icon {
    font-size: 14px;
  }
  
  .event-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    color: white;
    font-size: 15px;
    font-weight: 600;
    border-radius: 10px;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .event-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(30, 64, 175, 0.3);
  }
  
  /* Clubs Grid */
  .clubs-section {
    background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  }
  
  .clubs-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
  
  .club-card {
    background: white;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeInUp 0.6s ease-out both;
    border: 1px solid rgba(0, 0, 0, 0.04);
    text-align: center;
  }
  
  .club-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(30, 64, 175, 0.12);
  }
  
  .club-header {
    position: relative;
    margin-bottom: 20px;
  }
  
  .club-avatar {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 800;
    color: white;
    transition: transform 0.3s ease;
  }
  
  .club-card:hover .club-avatar {
    transform: rotate(5deg) scale(1.05);
  }
  
  .club-image {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    border-radius: 20px;
    object-fit: cover;
  }
  
  .club-category {
    position: absolute;
    top: -8px;
    right: 20%;
    background: #f97316;
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
  }
  
  .club-name {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
  }
  
  .club-description {
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
    margin-bottom: 16px;
  }
  
  .club-members {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 13px;
    color: #64748b;
    margin-bottom: 20px;
  }
  
  .club-btn {
    display: inline-block;
    padding: 10px 24px;
    background: #f0f9ff;
    color: #1e40af;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .club-btn:hover {
    background: #1e40af;
    color: white;
  }
  
  .sample-notice {
    text-align: center;
    margin-top: 32px;
    padding: 16px;
    background: #fef3c7;
    border-radius: 10px;
    color: #92400e;
    font-size: 14px;
    font-weight: 500;
  }
  
  /* Features Section */
  .features-section {
    background: white;
  }
  
  .features-header {
    text-align: center;
    margin-bottom: 60px;
  }
  
  .features-subtitle {
    font-size: 18px;
    color: #64748b;
    margin-top: 16px;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }
  
  .feature-card {
    background: linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%);
    padding: 32px;
    border-radius: 20px;
    text-align: center;
    transition: all 0.4s ease;
    animation: fadeInUp 0.6s ease-out both;
    border: 1px solid rgba(30, 64, 175, 0.06);
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(30, 64, 175, 0.1);
    background: white;
  }
  
  .feature-icon {
    font-size: 48px;
    margin-bottom: 20px;
    display: block;
  }
  
  .feature-title {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 12px;
  }
  
  .feature-description {
    font-size: 15px;
    color: #64748b;
    line-height: 1.6;
  }
  
  /* CTA Section */
  .cta-section {
    padding: 100px 24px;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
  }
  
  .cta-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  
  .cta-shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
  }
  
  .cta-shape-1 {
    width: 400px;
    height: 400px;
    top: -200px;
    right: -100px;
  }
  
  .cta-shape-2 {
    width: 300px;
    height: 300px;
    bottom: -150px;
    left: -50px;
  }
  
  .cta-content {
    max-width: 700px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 1;
  }
  
  .cta-title {
    font-size: 44px;
    font-weight: 800;
    color: white;
    margin-bottom: 20px;
    letter-spacing: -1px;
  }
  
  .cta-subtitle {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 40px;
    line-height: 1.6;
  }
  
  .cta-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
  }
  
  .btn-cta-white {
    background: white;
    color: #1e40af;
    padding: 16px 32px;
    font-size: 17px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  
  .btn-cta-white:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  }
  
  .btn-cta-outline {
    background: transparent;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.5);
    padding: 14px 28px;
    font-size: 17px;
    border-radius: 12px;
  }
  
  .btn-cta-outline:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
  }
  
  /* Footer */
  .footer {
    background: #0f172a;
    color: white;
    padding: 80px 24px 40px;
  }
  
  .footer-container {
    max-width: 1280px;
    margin: 0 auto;
  }
  
  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
    gap: 48px;
    margin-bottom: 60px;
  }
  
  .footer-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .footer-logo .logo-icon {
    font-size: 32px;
    filter: none;
    -webkit-text-fill-color: initial;
  }
  
  .footer-logo .logo-text {
    font-size: 18px;
    font-weight: 700;
    background: linear-gradient(135deg, #f97316, #fb923c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .footer-tagline {
    color: #94a3b8;
    font-size: 15px;
    line-height: 1.6;
    margin-bottom: 24px;
  }
  
  .social-links {
    display: flex;
    gap: 12px;
  }
  
  .social-link {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .social-link:hover {
    background: #1e40af;
    transform: translateY(-3px);
  }
  
  .footer-links h4 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
    color: white;
  }
  
  .footer-links ul {
    list-style: none;
  }
  
  .footer-links li {
    margin-bottom: 12px;
  }
  
  .footer-links a {
    color: #94a3b8;
    text-decoration: none;
    font-size: 15px;
    transition: color 0.3s ease;
  }
  
  .footer-links a:hover {
    color: #0ea5e9;
  }
  
  .footer-newsletter h4 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  
  .footer-newsletter p {
    color: #94a3b8;
    font-size: 14px;
    margin-bottom: 16px;
  }
  
  .newsletter-form {
    display: flex;
    gap: 8px;
  }
  
  .newsletter-form input {
    flex: 1;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-family: 'Outfit', sans-serif;
  }
  
  .newsletter-form input::placeholder {
    color: #64748b;
  }
  
  .newsletter-form input:focus {
    outline: none;
    border-color: #0ea5e9;
  }
  
  .newsletter-form button {
    padding: 12px 20px;
    background: #0ea5e9;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
    font-family: 'Outfit', sans-serif;
  }
  
  .newsletter-form button:hover {
    background: #0284c7;
  }
  
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 40px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .footer-bottom p {
    color: #64748b;
    font-size: 14px;
  }
  
  .footer-legal {
    display: flex;
    gap: 24px;
  }
  
  .footer-legal a {
    color: #64748b;
    font-size: 14px;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .footer-legal a:hover {
    color: #0ea5e9;
  }
  
  /* Responsive Design */
  @media (max-width: 1200px) {
    .events-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .clubs-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .footer-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .nav-actions {
      gap: 8px;
    }
    
    .btn {
      padding: 10px 16px;
      font-size: 14px;
    }
    
    .hero {
      padding: 100px 20px 60px;
    }
    
    .hero-title {
      font-size: 36px;
      letter-spacing: -1px;
    }
    
    .hero-subtitle {
      font-size: 17px;
    }
    
    .hero-cta {
      flex-direction: column;
      gap: 12px;
    }
    
    .hero-stats {
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .stat-divider {
      display: none;
    }
    
    .section {
      padding: 60px 20px;
    }
    
    .section-header {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }
    
    .section-title {
      font-size: 28px;
    }
    
    .events-grid,
    .clubs-grid,
    .features-grid {
      grid-template-columns: 1fr;
    }
    
    .cta-title {
      font-size: 32px;
    }
    
    .cta-buttons {
      flex-direction: column;
    }
    
    .footer-grid {
      grid-template-columns: 1fr;
      gap: 40px;
    }
    
    .footer-bottom {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }
  }
  
  @media (max-width: 480px) {
    .nav-logo .logo-text {
      display: none;
    }
    
    .hero-title {
      font-size: 28px;
    }
    
    .stat-number {
      font-size: 24px;
    }
  }
`;

export default Home;
