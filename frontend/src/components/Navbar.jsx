import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome, FaPlus, FaList, FaRobot,
  FaSignOutAlt, FaBars, FaTimes, FaUserCircle
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard',          label: 'Dashboard',   icon: <FaHome /> },
    { path: '/register-complaint', label: 'New Complaint', icon: <FaPlus /> },
    { path: '/complaints',         label: 'All Complaints', icon: <FaList /> },
    { path: '/ai-analysis',        label: 'AI Analysis', icon: <FaRobot /> },
  ];

  return (
    <>
      <nav style={styles.nav}>
        {/* Logo */}
        <div style={styles.logo}>
          🛡️ <span style={styles.logoText}>SmartComplaint</span>
        </div>

        {/* Desktop Links */}
        <div style={styles.navLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.navLink,
                ...(location.pathname === link.path ? styles.activeLink : {})
              }}
            >
              {link.icon} <span style={{ marginLeft: 6 }}>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* User Info + Logout */}
        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <FaUserCircle size={20} />
            <span style={{ marginLeft: 6 }}>{user?.name || 'User'}</span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <FaSignOutAlt /> <span style={{ marginLeft: 6 }}>Logout</span>
          </button>
        </div>

        {/* Hamburger for Mobile */}
        <div style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.mobileLink,
                ...(location.pathname === link.path ? styles.activeMobileLink : {})
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon} <span style={{ marginLeft: 8 }}>{link.label}</span>
            </Link>
          ))}
          <button onClick={handleLogout} style={styles.mobileLogout}>
            <FaSignOutAlt /> <span style={{ marginLeft: 8 }}>Logout</span>
          </button>
        </div>
      )}
    </>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 30px',
    height: '65px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#fff',
    cursor: 'pointer',
  },
  logoText: {
    marginLeft: 8,
    background: 'linear-gradient(90deg, #e94560, #0f3460)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '20px',
  },
  navLinks: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    color: '#ccc',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    ':hover': { background: 'rgba(255,255,255,0.1)' }
  },
  activeLink: {
    background: 'linear-gradient(135deg, #e94560, #c0392b)',
    color: '#fff',
    boxShadow: '0 2px 10px rgba(233,69,96,0.4)',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    color: '#ccc',
    fontSize: '14px',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #e94560, #c0392b)',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
  hamburger: {
    display: 'none',
    color: '#fff',
    cursor: 'pointer',
    '@media (max-width: 768px)': { display: 'block' }
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    background: '#16213e',
    padding: '16px',
    gap: '8px',
    position: 'sticky',
    top: '65px',
    zIndex: 999,
  },
  mobileLink: {
    display: 'flex',
    alignItems: 'center',
    color: '#ccc',
    textDecoration: 'none',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '15px',
  },
  activeMobileLink: {
    background: 'linear-gradient(135deg, #e94560, #c0392b)',
    color: '#fff',
  },
  mobileLogout: {
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #e94560, #c0392b)',
    color: '#fff',
    border: 'none',
    padding: '12px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    marginTop: '8px',
  }
};

export default Navbar;