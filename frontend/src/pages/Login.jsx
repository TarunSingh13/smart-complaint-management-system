import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', formData);
      login(res.data.user, res.data.token);
      toast.success('Login successful! Welcome back 👋');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <div style={styles.bigIcon}>🛡️</div>
          <h1 style={styles.leftTitle}>Smart Complaint System</h1>
          <p style={styles.leftSubtitle}>
            AI-powered complaint management for faster resolutions
          </p>
          <div style={styles.features}>
            {['AI-Based Priority Detection', 'Auto Department Assignment',
              'Real-time Status Tracking', 'Secure JWT Authentication'].map((f, i) => (
              <div key={i} style={styles.featureItem}>
                <span style={styles.tick}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome Back!</h2>
          <p style={styles.subtitle}>Login to your account</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Email */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <FaEnvelope style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            {/* Password */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <FaLock style={styles.inputIcon} />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.btn}>
              {loading ? (
                <span>Logging in...</span>
              ) : (
                <><FaSignInAlt style={{ marginRight: 8 }} /> Login</>
              )}
            </button>
          </form>

          <p style={styles.switchText}>
            Don't have an account?{' '}
            <Link to="/signup" style={styles.link}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', sans-serif",
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  leftContent: {
    maxWidth: '400px',
    color: '#fff',
  },
  bigIcon: {
    fontSize: '60px',
    marginBottom: '20px',
  },
  leftTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '12px',
    background: 'linear-gradient(90deg, #e94560, #fff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  leftSubtitle: {
    fontSize: '16px',
    color: '#aaa',
    marginBottom: '30px',
    lineHeight: 1.6,
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  featureItem: {
    fontSize: '15px',
    color: '#ccc',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  tick: {
    color: '#e94560',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f0f2f5',
    padding: '40px 20px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '6px',
  },
  subtitle: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '28px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#444',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    color: '#999',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px 14px 12px 40px',
    borderRadius: '10px',
    border: '1.5px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    transition: 'border 0.3s',
    boxSizing: 'border-box',
    background: '#f9f9f9',
  },
  btn: {
    padding: '13px',
    background: 'linear-gradient(135deg, #e94560, #c0392b)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '8px',
    boxShadow: '0 4px 15px rgba(233,69,96,0.4)',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666',
    fontSize: '14px',
  },
  link: {
    color: '#e94560',
    textDecoration: 'none',
    fontWeight: '600',
  }
};

export default Login;