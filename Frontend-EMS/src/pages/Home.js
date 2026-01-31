import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  GraduationCap, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight,
  Zap,
  CalendarDays,
  Target,
  Bell,
  Trophy,
  Handshake,
  Rocket,
  Sparkles,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Send,
  Code,
  Camera,
  Award,
  Star
} from 'lucide-react';

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

  const sampleEvents = [
    { _id: '1', name: 'Spoural 2025', description: 'The grand annual sports festival featuring inter-college competitions, athletic events, and team sports.', date: '2025-03-15', time: '9:00 AM', venue: 'Sports Complex', category: 'Sports' },
    { _id: '2', name: 'Cognizance', description: 'The flagship technical festival showcasing innovation, hackathons, and cutting-edge technology workshops.', date: '2025-03-20', time: '10:00 AM', venue: 'Tech Hub', category: 'Technical' },
    { _id: '3', name: 'Concerts Night', description: 'An electrifying evening of live music performances featuring popular bands and artists.', date: '2025-03-25', time: '6:00 PM', venue: 'Open Air Amphitheatre', category: 'Cultural' }
  ];

  const sampleClubs = [
    { _id: '1', name: 'Coding Club', description: 'Learn programming and build amazing projects', category: 'Tech', members: 156 },
    { _id: '2', name: 'Photography Society', description: 'Capture moments and master visual storytelling', category: 'Arts', members: 89 },
    { _id: '3', name: 'Debate Union', description: 'Sharpen your critical thinking and public speaking', category: 'Academic', members: 67 },
    { _id: '4', name: 'Sports Club', description: 'Stay fit and compete in various sports events', category: 'Sports', members: 234 }
  ];

  const features = [
    { icon: Zap, title: 'Easy Registration', description: 'One-click event sign-ups with instant confirmation' },
    { icon: CalendarDays, title: 'Smart Calendar', description: 'Sync events directly to your personal calendar' },
    { icon: Target, title: 'Club Management', description: 'Organize and manage your club activities seamlessly' },
    { icon: Bell, title: 'Smart Notifications', description: 'Never miss an event with timely reminders' },
    { icon: Trophy, title: 'Certificates', description: 'Earn digital certificates for participation' },
    { icon: Handshake, title: 'Networking', description: 'Connect with like-minded students and mentors' }
  ];

  const displayEvents = events.length > 0 ? events.slice(0, 3) : sampleEvents;
  const displayClubs = clubs.length > 0 ? clubs.slice(0, 4) : sampleClubs;

  const getCategoryColor = (category) => {
    const colors = {
      'Tech': 'linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%)',
      'Arts': 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
      'Academic': 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      'Sports': 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
      'Technical': 'linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%)',
      'Cultural': 'linear-gradient(135deg, #db2777 0%, #f472b6 100%)'
    };
    return colors[category] || 'linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%)';
  };

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
      {/* Background Decorative Elements */}
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
            <div className="logo-icon-wrapper">
              <GraduationCap size={28} strokeWidth={2.5} />
            </div>
            <span className="logo-text">Event Management System</span>
          </Link>
          <div className="nav-actions">
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">
              Register as Student
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with 60-40 Split */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient" />
          <div className="hero-blob" />
          <div className="hero-shapes">
            <div className="hero-circle hero-circle-1" />
            <div className="hero-circle hero-circle-2" />
            <div className="hero-circle hero-circle-3" />
          </div>
        </div>
        
        <div className="hero-container">
          {/* Left Side - Content (60%) */}
          <div className="hero-left">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Welcome to Campus Life</span>
            </div>
            
            <h1 className="hero-title">
              <span className="title-line">Discover Amazing</span>
              <span className="title-line title-highlight">Events & Clubs</span>
            </h1>
            
            <p className="hero-subtitle">
              Your gateway to unforgettable experiences, vibrant communities, and endless opportunities at our campus.
            </p>
            
            <div className="hero-cta">
              <Link to="/register" className="btn btn-cta">
                <span>Get Started</span>
                <ArrowRight size={20} className="cta-arrow" />
              </Link>
              <Link to="/login" className="btn btn-secondary">
                <Calendar size={20} />
                <span>Explore Events</span>
              </Link>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <Users size={18} />
                <span>5,000+ Students</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <Calendar size={18} />
                <span>500+ Events</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <Award size={18} />
                <span>50+ Clubs</span>
              </div>
            </div>
          </div>
          
          {/* Right Side - Floating Cards (40%) */}
          <div className="hero-right">
            <div className="floating-cards-container">
              {/* Event Card 1 - Sports */}
              <div className="floating-card floating-card-1">
                <div className="floating-card-image" style={{ background: getCategoryColor('Sports') }}>
                  <Trophy size={36} color="white" />
                  <div className="card-date-badge">
                    <span className="date-num">15</span>
                    <span className="date-mon">MAR</span>
                  </div>
                </div>
                <div className="floating-card-content">
                  <span className="card-tag sports">Sports</span>
                  <h4>Spoural 2025</h4>
                  <p>Annual sports festival</p>
                </div>
              </div>
              
              {/* Event Card 2 - Technical */}
              <div className="floating-card floating-card-2">
                <div className="floating-card-image" style={{ background: getCategoryColor('Technical') }}>
                  <Rocket size={36} color="white" />
                  <div className="card-date-badge">
                    <span className="date-num">20</span>
                    <span className="date-mon">MAR</span>
                  </div>
                </div>
                <div className="floating-card-content">
                  <span className="card-tag tech">Technical</span>
                  <h4>Cognizance</h4>
                  <p>Tech festival</p>
                </div>
              </div>
              
              {/* Club Card 3 */}
              <div className="floating-card floating-card-3 club-preview-card">
                <div className="club-card-inner">
                  <div className="club-icon-wrapper">
                    <Code size={28} color="white" />
                  </div>
                  <h4>Coding Club</h4>
                  <p>Learn & Build Projects</p>
                  <div className="club-members-badge">
                    <Users size={14} />
                    <span>156 members</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="deco-circle deco-circle-1" />
              <div className="deco-circle deco-circle-2" />
              <div className="deco-dot deco-dot-1" />
              <div className="deco-dot deco-dot-2" />
              <div className="deco-dot deco-dot-3" />
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="section events-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-title-group">
              <div className="section-icon-wrapper"><Calendar size={28} /></div>
              <div>
                <h2 className="section-title">Upcoming Events</h2>
                <p className="section-subtitle">Don't miss out on these amazing experiences</p>
              </div>
            </div>
            <Link to="/login" className="view-all-link">
              View All Events<ArrowRight size={18} />
            </Link>
          </div>
          
          <div className="events-grid">
            {displayEvents.map((event, index) => (
              <div key={event._id} className="event-card" style={{ animationDelay: `${index * 0.15}s` }}>
                {index === 0 && <div className="featured-badge"><Star size={12} /> Featured</div>}
                <div className="event-image">
                  {event.image || event.primaryImage ? (
                    <img src={event.image || event.primaryImage} alt={event.name} />
                  ) : (
                    <div className="event-placeholder" style={{ background: getCategoryColor(event.category) }}>
                      <Calendar size={48} color="white" strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="event-overlay" />
                  <div className="event-date-badge">
                    <span className="date-day">{new Date(event.date).getDate()}</span>
                    <span className="date-month">{new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                  </div>
                  {event.category && <span className="event-category">{event.category}</span>}
                </div>
                <div className="event-content">
                  <h3 className="event-title">{event.name}</h3>
                  <p className="event-description">{event.description?.substring(0, 80)}...</p>
                  <div className="event-meta">
                    <span className="meta-item"><Clock size={14} />{event.time}</span>
                    <span className="meta-item"><MapPin size={14} />{event.venue}</span>
                  </div>
                  <Link to="/login" className="event-btn">Register Now<ArrowRight size={16} /></Link>
                </div>
              </div>
            ))}
          </div>
          
          {events.length === 0 && (
            <p className="sample-notice"><Sparkles size={16} style={{ marginRight: '8px' }} />Sample events shown for preview. Real events will appear here!</p>
          )}
        </div>
      </section>

      {/* Our Clubs Section */}
      <section className="section clubs-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-title-group">
              <div className="section-icon-wrapper purple"><Users size={28} /></div>
              <div>
                <h2 className="section-title">Our Clubs</h2>
                <p className="section-subtitle">Find your passion and connect with like-minded students</p>
              </div>
            </div>
            <Link to="/login" className="view-all-link">Explore All Clubs<ArrowRight size={18} /></Link>
          </div>
          
          <div className="clubs-grid">
            {displayClubs.map((club, index) => (
              <div key={club._id} className="club-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="club-header">
                  {club.image ? (
                    <img src={club.image} alt={club.name} className="club-image" />
                  ) : (
                    <div className="club-avatar" style={{ background: getCategoryColor(club.category) }}>
                      {club.category === 'Tech' && <Code size={28} color="white" />}
                      {club.category === 'Arts' && <Camera size={28} color="white" />}
                      {club.category === 'Academic' && <GraduationCap size={28} color="white" />}
                      {club.category === 'Sports' && <Trophy size={28} color="white" />}
                      {!['Tech', 'Arts', 'Academic', 'Sports'].includes(club.category) && club.name.charAt(0)}
                    </div>
                  )}
                  {club.category && <span className="club-category">{club.category}</span>}
                </div>
                <div className="club-content">
                  <h3 className="club-name">{club.name}</h3>
                  <p className="club-description">{club.description}</p>
                  {club.members && (
                    <div className="club-members">
                      <div className="member-avatars">
                        <div className="member-avatar" style={{ background: '#1e40af' }} />
                        <div className="member-avatar" style={{ background: '#0ea5e9' }} />
                        <div className="member-avatar" style={{ background: '#7c3aed' }} />
                      </div>
                      <span>+{club.members} members</span>
                    </div>
                  )}
                  <Link to="/login" className="club-btn">Join Club</Link>
                </div>
              </div>
            ))}
          </div>
          
          {clubs.length === 0 && (
            <p className="sample-notice"><Sparkles size={16} style={{ marginRight: '8px' }} />Sample clubs shown for preview. Real clubs will appear here!</p>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="section-container">
          <div className="features-header">
            <div className="section-icon-wrapper orange"><Rocket size={28} /></div>
            <h2 className="section-title">Everything You Need for Campus Life</h2>
            <p className="features-subtitle">Powerful features to enhance your experience</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="feature-icon-wrapper"><IconComponent size={32} /></div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-bg">
          <div className="cta-shape cta-shape-1" />
          <div className="cta-shape cta-shape-2" />
          <div className="cta-shape cta-shape-3" />
        </div>
        <div className="cta-content">
          <div className="cta-icon">
            <Rocket size={40} />
          </div>
          <h2 className="cta-title">Ready to Transform Your Campus Experience?</h2>
          <p className="cta-subtitle">Join thousands of students discovering amazing events, building connections, and creating memories that last a lifetime.</p>
          <div className="cta-trust">
            <span className="trust-badge"><Zap size={16} /> Free to Join</span>
            <span className="trust-badge"><Calendar size={16} /> 500+ Events</span>
            <span className="trust-badge"><Users size={16} /> 50+ Clubs</span>
          </div>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-cta-white">Create Free Account<ArrowRight size={18} /></Link>
            <Link to="/login" className="btn btn-cta-outline">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon"><GraduationCap size={28} /></div>
                <span className="footer-logo-text">Event Management System</span>
              </div>
              <p className="footer-tagline">Your gateway to campus life, events, and vibrant student communities.</p>
              <div className="social-links">
                <button type="button" className="social-link" aria-label="Facebook"><Facebook size={18} /></button>
                <button type="button" className="social-link" aria-label="Instagram"><Instagram size={18} /></button>
                <button type="button" className="social-link" aria-label="Twitter"><Twitter size={18} /></button>
                <button type="button" className="social-link" aria-label="LinkedIn"><Linkedin size={18} /></button>
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
                <div className="newsletter-input-wrapper">
                  <Mail size={18} className="newsletter-icon" />
                  <input type="email" placeholder="Enter your email" />
                </div>
                <button type="button"><Send size={18} /></button>
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
  .loading-content { text-align: center; }
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e0f2fe;
    border-top: 4px solid #1e40af;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 16px;
  }
  .loading-content p { color: #475569; font-size: 16px; font-family: 'DM Sans', sans-serif; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  
  .home-page {
    font-family: 'DM Sans', 'Outfit', -apple-system, sans-serif;
    background: linear-gradient(180deg, #f0f9ff 0%, #ffffff 30%, #ffffff 70%, #f0f9ff 100%);
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }
  
  /* Background Elements */
  .bg-elements { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; overflow: hidden; }
  .floating-shape { position: absolute; border-radius: 50%; opacity: 0.5; animation: floatBg 20s ease-in-out infinite; }
  .shape-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%); top: -150px; right: -150px; filter: blur(60px); }
  .shape-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(30, 64, 175, 0.08) 0%, transparent 70%); bottom: 20%; left: -150px; animation-delay: -5s; filter: blur(50px); }
  .shape-3 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, transparent 70%); top: 50%; right: 10%; animation-delay: -10s; filter: blur(40px); }
  .shape-4 { width: 450px; height: 450px; background: radial-gradient(circle, rgba(30, 64, 175, 0.06) 0%, transparent 70%); bottom: -150px; right: 25%; animation-delay: -15s; filter: blur(70px); }
  .grid-pattern { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: linear-gradient(rgba(30, 64, 175, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 64, 175, 0.02) 1px, transparent 1px); background-size: 60px 60px; }
  
  @keyframes floatBg { 0%, 100% { transform: translate(0, 0) scale(1); } 25% { transform: translate(30px, -30px) scale(1.05); } 50% { transform: translate(-20px, 20px) scale(0.95); } 75% { transform: translate(20px, 30px) scale(1.02); } }
  
  /* Navbar */
  .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 16px 24px; transition: all 0.3s ease; }
  .navbar-scrolled { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08); padding: 12px 24px; }
  .nav-container { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
  .nav-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
  .logo-icon-wrapper { width: 48px; height: 48px; background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 15px rgba(30, 64, 175, 0.35); }
  .logo-text { font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px; font-family: 'Outfit', sans-serif; }
  .nav-actions { display: flex; gap: 12px; align-items: center; }
  
  /* Buttons */
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; font-size: 15px; font-weight: 600; font-family: 'DM Sans', sans-serif; border-radius: 12px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); text-decoration: none; border: none; }
  .btn-outline { background: transparent; color: #1e40af; border: 2px solid #1e40af; }
  .btn-outline:hover { background: #1e40af; color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3); }
  .btn-primary { background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%); color: white; border: none; box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3); }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4); }
  .btn-primary svg { transition: transform 0.3s ease; }
  .btn-primary:hover svg { transform: translateX(4px); }
  
  /* Hero Section */
  .hero { min-height: 100vh; display: flex; align-items: center; padding: 120px 24px 80px; position: relative; overflow: hidden; }
  .hero-bg { position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0; }
  .hero-gradient { position: absolute; top: 0; right: 0; width: 60%; height: 100%; background: linear-gradient(135deg, transparent 0%, rgba(14, 165, 233, 0.08) 50%, rgba(30, 64, 175, 0.12) 100%); clip-path: polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%); }
  .hero-blob { position: absolute; width: 600px; height: 600px; background: linear-gradient(135deg, rgba(30, 64, 175, 0.08), rgba(14, 165, 233, 0.08)); border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; top: 50%; right: 5%; transform: translate(0, -50%); filter: blur(60px); animation: blobMove 15s ease-in-out infinite; z-index: 0; }
  @keyframes blobMove { 0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; } 50% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; } }
  .hero-shapes { position: absolute; top: 0; left: 0; right: 0; bottom: 0; }
  .hero-circle { position: absolute; border-radius: 50%; border: 1px solid rgba(30, 64, 175, 0.1); }
  .hero-circle-1 { width: 600px; height: 600px; top: -200px; right: -100px; animation: pulse 8s ease-in-out infinite; }
  .hero-circle-2 { width: 400px; height: 400px; bottom: -100px; left: -100px; animation: pulse 10s ease-in-out infinite reverse; }
  .hero-circle-3 { width: 200px; height: 200px; top: 30%; right: 20%; background: rgba(14, 165, 233, 0.05); animation: pulse 6s ease-in-out infinite; }
  @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 0.8; } }
  
  /* Hero Container - 60-40 Split */
  .hero-container { max-width: 1400px; margin: 0 auto; position: relative; z-index: 1; display: grid; grid-template-columns: 60% 40%; gap: 40px; align-items: center; width: 100%; }
  
  /* Hero Left */
  .hero-left { padding-right: 20px; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(14, 165, 233, 0.1); color: #0ea5e9; border-radius: 50px; font-size: 14px; font-weight: 600; margin-bottom: 24px; animation: fadeInUp 0.6s ease-out, pulse 3s ease-in-out infinite; }
  .hero-title { font-size: clamp(44px, 5vw, 72px); font-weight: 900; line-height: 1.08; margin-bottom: 24px; letter-spacing: -2px; font-family: 'Outfit', sans-serif; }
  .title-line { display: block; color: #0f172a; animation: fadeInUp 0.6s ease-out; animation-fill-mode: both; }
  .title-line:nth-child(1) { animation-delay: 0.1s; }
  .title-line:nth-child(2) { animation-delay: 0.2s; }
  .title-highlight { background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .hero-subtitle { font-size: 20px; color: #475569; line-height: 1.7; max-width: 540px; margin-bottom: 36px; animation: fadeInUp 0.6s ease-out 0.3s both; }
  .hero-cta { display: flex; gap: 16px; margin-bottom: 40px; animation: fadeInUp 0.6s ease-out 0.4s both; flex-wrap: wrap; }
  
  .btn-cta { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 18px 40px; font-size: 17px; border-radius: 14px; box-shadow: 0 4px 20px rgba(249, 115, 22, 0.35); }
  .btn-cta:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(249, 115, 22, 0.45); }
  .cta-arrow { transition: transform 0.3s ease; }
  .btn-cta:hover .cta-arrow { transform: translateX(5px); }
  .btn-secondary { background: white; color: #1e40af; border: 2px solid #1e40af; padding: 16px 32px; font-size: 17px; border-radius: 14px; }
  .btn-secondary:hover { background: #1e40af; color: white; transform: translateY(-3px); box-shadow: 0 8px 20px rgba(30, 64, 175, 0.3); }
  .btn-secondary:hover svg { color: white; }
  
  .hero-stats { display: flex; align-items: center; gap: 20px; animation: fadeInUp 0.6s ease-out 0.5s both; flex-wrap: wrap; }
  .stat-item { display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 15px; font-weight: 500; }
  .stat-item svg { color: #1e40af; }
  .stat-divider { width: 1px; height: 20px; background: #cbd5e1; }
  
  /* Hero Right - Floating Cards */
  .hero-right { position: relative; height: 550px; display: none; }
  @media (min-width: 1024px) { .hero-right { display: block; } }
  
  .floating-cards-container { position: relative; width: 100%; height: 100%; }
  
  .floating-card { position: absolute; background: rgba(255, 255, 255, 0.98); border-radius: 20px; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12); overflow: hidden; transition: all 0.4s ease; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.8); }
  .floating-card:hover { transform: translateY(-10px) scale(1.02) !important; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.18); }
  
  .floating-card-1 { width: 260px; top: 5%; left: 0%; animation: floatCard1 4s ease-in-out infinite; }
  .floating-card-2 { width: 260px; top: 38%; right: 5%; animation: floatCard2 4.5s ease-in-out infinite; z-index: 2; }
  .floating-card-3 { width: 220px; bottom: 8%; left: 10%; animation: floatCard3 5s ease-in-out infinite; }
  
  @keyframes floatCard1 { 0%, 100% { transform: translateY(0px) rotate(3deg); } 50% { transform: translateY(-20px) rotate(3deg); } }
  @keyframes floatCard2 { 0%, 100% { transform: translateY(0px) rotate(-2deg); } 50% { transform: translateY(-18px) rotate(-2deg); } }
  @keyframes floatCard3 { 0%, 100% { transform: translateY(0px) rotate(5deg); } 50% { transform: translateY(-15px) rotate(5deg); } }
  
  .floating-card-image { height: 140px; display: flex; align-items: center; justify-content: center; position: relative; }
  .card-date-badge { position: absolute; top: 12px; left: 12px; background: white; padding: 8px 12px; border-radius: 10px; text-align: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
  .date-num { display: block; font-size: 20px; font-weight: 800; color: #1e40af; line-height: 1; font-family: 'Outfit', sans-serif; }
  .date-mon { display: block; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 2px; }
  
  .floating-card-content { padding: 16px 20px; }
  .card-tag { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
  .card-tag.sports { background: rgba(249, 115, 22, 0.1); color: #ea580c; }
  .card-tag.tech { background: rgba(30, 64, 175, 0.1); color: #1e40af; }
  .floating-card-content h4 { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 4px; font-family: 'Outfit', sans-serif; }
  .floating-card-content p { font-size: 13px; color: #64748b; }
  
  /* Club Preview Card */
  .club-preview-card { padding: 0; }
  .club-card-inner { padding: 24px; text-align: center; }
  .club-icon-wrapper { width: 60px; height: 60px; margin: 0 auto 16px; background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3); }
  .club-card-inner h4 { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 4px; font-family: 'Outfit', sans-serif; }
  .club-card-inner p { font-size: 13px; color: #64748b; margin-bottom: 12px; }
  .club-members-badge { display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 12px; color: #64748b; }
  .club-members-badge svg { color: #1e40af; }
  
  /* Decorative Elements */
  .deco-circle { position: absolute; border-radius: 50%; background: radial-gradient(circle, rgba(14, 165, 233, 0.15), transparent); animation: floatBg 18s ease-in-out infinite; }
  .deco-circle-1 { width: 200px; height: 200px; top: -30px; right: -30px; filter: blur(30px); }
  .deco-circle-2 { width: 150px; height: 150px; bottom: 20%; right: 60%; filter: blur(25px); animation-delay: -5s; }
  .deco-dot { position: absolute; width: 10px; height: 10px; border-radius: 50%; background: linear-gradient(135deg, #1e40af, #0ea5e9); animation: floatDot 3s ease-in-out infinite; }
  .deco-dot-1 { top: 20%; right: 20%; }
  .deco-dot-2 { top: 60%; left: 5%; animation-delay: -1s; }
  .deco-dot-3 { bottom: 30%; right: 40%; animation-delay: -2s; }
  @keyframes floatDot { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; } 50% { transform: translateY(-10px) scale(1.2); opacity: 1; } }
  
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  
  /* Sections */
  .section { padding: 100px 24px; position: relative; z-index: 1; }
  .section-container { max-width: 1400px; margin: 0 auto; }
  .section-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; }
  .section-title-group { display: flex; align-items: flex-start; gap: 20px; }
  .section-icon-wrapper { width: 60px; height: 60px; background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%); border-radius: 18px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3); flex-shrink: 0; }
  .section-icon-wrapper.purple { background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%); box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3); }
  .section-icon-wrapper.orange { background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3); }
  .section-title { font-size: 36px; font-weight: 800; color: #0f172a; letter-spacing: -1px; font-family: 'Outfit', sans-serif; margin-bottom: 6px; }
  .section-subtitle { font-size: 16px; color: #64748b; }
  .view-all-link { display: flex; align-items: center; gap: 8px; color: #1e40af; font-weight: 600; text-decoration: none; transition: all 0.3s ease; padding: 14px 24px; border-radius: 12px; background: rgba(30, 64, 175, 0.05); margin-top: 8px; }
  .view-all-link:hover { gap: 12px; background: rgba(30, 64, 175, 0.1); color: #0ea5e9; }
  
  /* Events Grid */
  .events-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
  .event-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 24px; overflow: hidden; box-shadow: 0 4px 25px rgba(0, 0, 0, 0.06); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); animation: fadeInUp 0.6s ease-out both; border: 1px solid rgba(255, 255, 255, 0.8); position: relative; }
  .event-card:hover { transform: translateY(-10px); box-shadow: 0 25px 50px rgba(30, 64, 175, 0.15); }
  .featured-badge { position: absolute; top: 16px; right: 16px; z-index: 10; background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4); }
  .event-image { position: relative; height: 200px; overflow: hidden; }
  .event-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .event-card:hover .event-image img { transform: scale(1.1); }
  .event-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
  .event-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.4) 100%); }
  .event-date-badge { position: absolute; top: 16px; left: 16px; background: white; padding: 12px 16px; border-radius: 14px; text-align: center; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15); }
  .date-day { display: block; font-size: 26px; font-weight: 800; color: #1e40af; line-height: 1; font-family: 'Outfit', sans-serif; }
  .date-month { display: block; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 3px; letter-spacing: 0.5px; }
  .event-category { position: absolute; bottom: 16px; left: 16px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(5px); padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; color: #1e40af; text-transform: uppercase; letter-spacing: 0.5px; }
  .event-content { padding: 28px; }
  .event-title { font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 12px; line-height: 1.3; font-family: 'Outfit', sans-serif; }
  .event-description { font-size: 15px; color: #64748b; line-height: 1.6; margin-bottom: 16px; }
  .event-meta { display: flex; gap: 20px; margin-bottom: 24px; }
  .meta-item { display: flex; align-items: center; gap: 6px; font-size: 14px; color: #64748b; }
  .meta-item svg { color: #1e40af; }
  .event-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 16px; background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%); color: white; font-size: 15px; font-weight: 600; border-radius: 14px; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(30, 64, 175, 0.25); }
  .event-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(30, 64, 175, 0.35); }
  .event-btn svg { transition: transform 0.3s ease; }
  .event-btn:hover svg { transform: translateX(4px); }
  
  /* Clubs Section */
  .clubs-section { background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%); }
  .clubs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; }
  .club-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 24px; padding: 32px; box-shadow: 0 4px 25px rgba(0, 0, 0, 0.05); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); animation: fadeInUp 0.6s ease-out both; border: 1px solid rgba(255, 255, 255, 0.8); text-align: center; }
  .club-card:hover { transform: translateY(-10px) scale(1.02); box-shadow: 0 25px 50px rgba(30, 64, 175, 0.12); }
  .club-header { position: relative; margin-bottom: 24px; }
  .club-avatar { width: 88px; height: 88px; margin: 0 auto; border-radius: 22px; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 800; color: white; transition: transform 0.4s ease; font-family: 'Outfit', sans-serif; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); }
  .club-card:hover .club-avatar { transform: rotate(5deg) scale(1.08); }
  .club-image { width: 88px; height: 88px; margin: 0 auto; border-radius: 22px; object-fit: cover; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); }
  .club-category { position: absolute; top: -10px; right: 15%; background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); color: white; padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; box-shadow: 0 4px 10px rgba(249, 115, 22, 0.35); text-transform: uppercase; letter-spacing: 0.5px; }
  .club-name { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 10px; font-family: 'Outfit', sans-serif; }
  .club-description { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 20px; }
  .club-members { display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 14px; color: #64748b; margin-bottom: 24px; }
  .member-avatars { display: flex; }
  .member-avatar { width: 28px; height: 28px; border-radius: 50%; margin-left: -10px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); }
  .member-avatar:first-child { margin-left: 0; }
  .club-btn { display: inline-block; padding: 14px 32px; background: rgba(30, 64, 175, 0.06); color: #1e40af; font-size: 15px; font-weight: 600; border-radius: 12px; text-decoration: none; transition: all 0.3s ease; border: 2px solid transparent; }
  .club-btn:hover { background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%); color: white; box-shadow: 0 8px 20px rgba(30, 64, 175, 0.3); }
  
  .sample-notice { text-align: center; margin-top: 40px; padding: 18px 28px; background: linear-gradient(135deg, rgba(30, 64, 175, 0.06) 0%, rgba(14, 165, 233, 0.06) 100%); border-radius: 16px; color: #1e40af; font-size: 15px; font-weight: 500; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(30, 64, 175, 0.1); }
  
  /* Features Section */
  .features-section { background: white; }
  .features-header { text-align: center; margin-bottom: 64px; }
  .features-header .section-icon-wrapper { margin: 0 auto 24px; }
  .features-header .section-title { margin-bottom: 16px; font-size: 40px; }
  .features-subtitle { font-size: 18px; color: #64748b; max-width: 550px; margin: 0 auto; line-height: 1.6; }
  .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
  .feature-card { background: linear-gradient(135deg, rgba(240, 249, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%); backdrop-filter: blur(10px); padding: 40px 32px; border-radius: 24px; text-align: center; transition: all 0.4s ease; animation: fadeInUp 0.6s ease-out both; border: 1px solid rgba(30, 64, 175, 0.06); }
  .feature-card:hover { transform: translateY(-8px); box-shadow: 0 25px 50px rgba(30, 64, 175, 0.12); background: white; }
  .feature-icon-wrapper { width: 80px; height: 80px; margin: 0 auto 28px; background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%); border-radius: 24px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 25px rgba(30, 64, 175, 0.35); transition: transform 0.4s ease; }
  .feature-card:hover .feature-icon-wrapper { transform: scale(1.1) rotate(5deg); }
  .feature-title { font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 14px; font-family: 'Outfit', sans-serif; }
  .feature-description { font-size: 15px; color: #64748b; line-height: 1.7; }
  
  /* CTA Section */
  .cta-section { padding: 120px 24px; position: relative; overflow: hidden; background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%); }
  .cta-bg { position: absolute; top: 0; left: 0; right: 0; bottom: 0; }
  .cta-shape { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.06); }
  .cta-shape-1 { width: 500px; height: 500px; top: -250px; right: -150px; animation: floatBg 20s ease-in-out infinite; }
  .cta-shape-2 { width: 400px; height: 400px; bottom: -200px; left: -100px; animation: floatBg 25s ease-in-out infinite reverse; }
  .cta-shape-3 { width: 200px; height: 200px; top: 50%; left: 20%; animation: floatBg 15s ease-in-out infinite; }
  .cta-content { max-width: 800px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }
  .cta-icon { width: 88px; height: 88px; margin: 0 auto 32px; background: rgba(255, 255, 255, 0.15); border-radius: 24px; display: flex; align-items: center; justify-content: center; color: white; animation: floatDot 4s ease-in-out infinite; }
  .cta-title { font-size: 48px; font-weight: 800; color: white; margin-bottom: 20px; letter-spacing: -1.5px; font-family: 'Outfit', sans-serif; line-height: 1.15; }
  .cta-subtitle { font-size: 20px; color: rgba(255, 255, 255, 0.9); margin-bottom: 32px; line-height: 1.7; max-width: 650px; margin-left: auto; margin-right: auto; }
  .cta-trust { display: flex; justify-content: center; gap: 24px; margin-bottom: 40px; flex-wrap: wrap; }
  .trust-badge { display: flex; align-items: center; gap: 8px; color: rgba(255, 255, 255, 0.85); font-size: 15px; font-weight: 500; }
  .cta-buttons { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .btn-cta-white { background: white; color: #1e40af; padding: 18px 36px; font-size: 17px; border-radius: 14px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2); }
  .btn-cta-white:hover { transform: translateY(-3px); box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25); }
  .btn-cta-white svg { transition: transform 0.3s ease; }
  .btn-cta-white:hover svg { transform: translateX(4px); }
  .btn-cta-outline { background: transparent; color: white; border: 2px solid rgba(255, 255, 255, 0.5); padding: 16px 32px; font-size: 17px; border-radius: 14px; }
  .btn-cta-outline:hover { background: rgba(255, 255, 255, 0.15); border-color: white; }
  
  /* Footer */
  .footer { background: #0f172a; color: white; padding: 100px 24px 50px; }
  .footer-container { max-width: 1400px; margin: 0 auto; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 60px; margin-bottom: 70px; }
  .footer-logo { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
  .footer-logo-icon { width: 50px; height: 50px; background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; }
  .footer-logo-text { font-size: 20px; font-weight: 700; color: white; font-family: 'Outfit', sans-serif; }
  .footer-tagline { color: #94a3b8; font-size: 16px; line-height: 1.7; margin-bottom: 28px; max-width: 300px; }
  .social-links { display: flex; gap: 12px; }
  .social-link { width: 48px; height: 48px; background: rgba(255, 255, 255, 0.08); border-radius: 14px; border: none; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer; transition: all 0.3s ease; padding: 0; margin: 0; }
  .social-link:hover { background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%); transform: translateY(-4px); box-shadow: 0 8px 20px rgba(30, 64, 175, 0.4); }
  .footer-links h4 { font-size: 17px; font-weight: 700; margin-bottom: 24px; color: white; font-family: 'Outfit', sans-serif; }
  .footer-links ul { list-style: none; padding: 0; margin: 0; }
  .footer-links li { margin-bottom: 14px; }
  .footer-links a { color: #94a3b8; text-decoration: none; font-size: 15px; transition: color 0.3s ease; }
  .footer-links a:hover { color: #0ea5e9; }
  .footer-newsletter h4 { font-size: 17px; font-weight: 700; margin-bottom: 14px; font-family: 'Outfit', sans-serif; }
  .footer-newsletter p { color: #94a3b8; font-size: 15px; margin-bottom: 20px; line-height: 1.6; }
  .newsletter-form { display: flex; gap: 10px; }
  .newsletter-input-wrapper { flex: 1; position: relative; }
  .newsletter-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #64748b; }
  .newsletter-form input { width: 100%; padding: 16px 18px 16px 48px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; color: white; font-size: 15px; font-family: 'DM Sans', sans-serif; transition: all 0.3s ease; }
  .newsletter-form input::placeholder { color: #64748b; }
  .newsletter-form input:focus { outline: none; border-color: #0ea5e9; background: rgba(255, 255, 255, 0.12); }
  .newsletter-form button { padding: 16px 20px; background: linear-gradient(135deg, #0ea5e9 0%, #1e40af 100%); color: white; border: none; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; margin: 0; }
  .newsletter-form button:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(14, 165, 233, 0.4); }
  .footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 50px; border-top: 1px solid rgba(255, 255, 255, 0.08); }
  .footer-bottom p { color: #64748b; font-size: 14px; }
  .footer-legal { display: flex; gap: 28px; }
  .footer-legal a { color: #64748b; font-size: 14px; text-decoration: none; transition: color 0.3s ease; }
  .footer-legal a:hover { color: #0ea5e9; }
  
  /* Responsive Design */
  @media (max-width: 1200px) { 
    .hero-container { grid-template-columns: 1fr; } 
    .hero-right { display: none; }
    .events-grid { grid-template-columns: repeat(2, 1fr); } 
    .clubs-grid { grid-template-columns: repeat(2, 1fr); } 
    .footer-grid { grid-template-columns: repeat(2, 1fr); } 
  }
  @media (max-width: 768px) { 
    .nav-actions { gap: 8px; } 
    .btn { padding: 10px 18px; font-size: 14px; } 
    .hero { padding: 100px 20px 60px; } 
    .hero-title { font-size: 38px; letter-spacing: -1px; } 
    .hero-subtitle { font-size: 17px; } 
    .hero-cta { flex-direction: column; gap: 12px; } 
    .btn-cta, .btn-secondary { width: 100%; justify-content: center; }
    .hero-stats { justify-content: center; }
    .stat-divider { display: none; }
    .section { padding: 70px 20px; } 
    .section-header { flex-direction: column; gap: 20px; text-align: center; } 
    .section-title-group { flex-direction: column; align-items: center; text-align: center; }
    .section-title { font-size: 30px; } 
    .events-grid, .clubs-grid, .features-grid { grid-template-columns: 1fr; } 
    .cta-title { font-size: 34px; } 
    .cta-buttons { flex-direction: column; } 
    .btn-cta-white, .btn-cta-outline { width: 100%; justify-content: center; }
    .footer-grid { grid-template-columns: 1fr; gap: 48px; } 
    .footer-bottom { flex-direction: column; gap: 20px; text-align: center; } 
  }
  @media (max-width: 480px) { 
    .nav-logo .logo-text { display: none; } 
    .hero-title { font-size: 32px; }
    .hero-badge { font-size: 12px; padding: 6px 12px; }
    .cta-trust { gap: 16px; }
    .trust-badge { font-size: 13px; }
  }
`;

export default Home;
