import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <span className="logo-text">VideoTracker</span>
            <span className="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M4 8H2v12a2 2 0 002 2h12v-2H4V8z" />
                <path d="M20 2H8a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zm-9 12V6l7 4-7 4z" />
              </svg>
            </span>
          </Link>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li className="nav-item">
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                Home
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          <div className="nav-auth">
            {isAuthenticated ? (
              <>
                <div className="user-info">
                  <span className="user-avatar">
                    {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </span>
                  <span className="user-name">
                    {user?.firstName || user?.username}
                  </span>
                </div>
                <button className="btn btn-outline logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline login-btn">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary register-btn">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>

        <div className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <style jsx="true">{`
        .header {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          height: var(--header-height);
          background-color: var(--background-light);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          transition: var(--transition);
        }

        .header.scrolled {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          background-color: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
        }

        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
        }

        .logo {
          display: flex;
          align-items: center;
        }

        .logo a {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary-color);
          font-weight: 700;
          font-size: 1.5rem;
        }

        .logo-text {
          display: inline-block;
        }

        .logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-color);
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 1.5rem;
        }

        .nav-item a {
          color: var(--text-color);
          font-weight: 500;
          padding: 0.5rem 0;
          position: relative;
        }

        .nav-item a:hover, .nav-item a.active {
          color: var(--primary-color);
        }

        .nav-item a::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--primary-color);
          transition: var(--transition);
        }

        .nav-item a:hover::after, .nav-item a.active::after {
          width: 100%;
        }

        .nav-auth {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .user-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background-color: var(--primary-color);
          color: white;
          border-radius: 50%;
          font-weight: 600;
        }

        .user-name {
          font-weight: 500;
        }

        .mobile-menu-toggle {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 24px;
          height: 18px;
          cursor: pointer;
        }

        .mobile-menu-toggle span {
          display: block;
          height: 2px;
          width: 100%;
          background-color: var(--text-color);
          transition: var(--transition);
        }

        @media (max-width: 768px) {
          .nav-menu {
            position: fixed;
            top: var(--header-height);
            left: 0;
            width: 100%;
            height: calc(100vh - var(--header-height));
            background-color: var(--background-light);
            flex-direction: column;
            justify-content: flex-start;
            padding: 2rem;
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
            z-index: 999;
          }

          .nav-menu.active {
            transform: translateX(0);
          }

          .nav-links {
            flex-direction: column;
            width: 100%;
          }

          .nav-auth {
            flex-direction: column;
            width: 100%;
            margin-top: 2rem;
          }

          .login-btn, .register-btn, .logout-btn {
            width: 100%;
            text-align: center;
          }

          .mobile-menu-toggle {
            display: flex;
          }

          .mobile-menu-toggle.active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
          }

          .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
          }

          .mobile-menu-toggle.active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
          }

          .logo-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;