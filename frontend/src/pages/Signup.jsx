import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'user'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters!');
    }
    setLoading(true);
    try {
      await API.post('/auth/signup', formData);
      toast.success('Account created! Please login 🎉');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <div style={styles.bigIcon}>📝</div>
          <h1 style={styles.leftTitle}>Join SmartComplaint</h1>
          <p style={styles.leftSubtitle}>
            Register once and track all your complaints with AI-powered insights
          </p>
          <div style={styles.steps}>
            {[
              { step: '1', text: 'Create your account' },
              { step: '2', text: 'Submit your complaint' },
              { step: '3', text: 'AI analyzes & assigns' },
              { step: '4', text: 'Track resolution status' },
            ].map((s) => (
              <div key={s.step} style={styles.stepItem}>
                <div style={styles.stepNum}>{s.step}</div>
                <span style={styles.stepText}>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Fill in details to get started</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Name */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrapper}>
                <FaUser style={styles.inputIcon} />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

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
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            {/* Role */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Register As</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" disabled={loading} style={styles.btn}>
              {loading ? 'Creating Account...' : (
                <><FaUserPlus style={{ marginRight: 8 }} /> Create Account</>
              )}
            </button>
          </form>

          <p style={styles.switchText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>Login</Link>
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
    background: 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  leftContent: { maxWidth: '400px', color: '#fff' },
  bigIcon: { fontSize: '60px', marginBottom: '20px' },
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
  steps: { display: 'flex', flexDirection: 'column', gap: '16px' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '14px' },
  stepNum: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #e94560, #c0392b)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    flexShrink: 0,
  },
  stepText: { color: '#ccc', fontSize: '15px' },
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
  title: { fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '6px' },
  subtitle: { color: '#888', fontSize: '14px', marginBottom: '28px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#444' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '14px', color: '#999', fontSize: '14px' },
  input: {
    width: '100%',
    padding: '12px 14px 12px 40px',
    borderRadius: '10px',
    border: '1.5px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#f9f9f9',
  },
  select: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1.5px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    background: '#f9f9f9',
    cursor: 'pointer',
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
  switchText: { textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '14px' },
  link: { color: '#e94560', textDecoration: 'none', fontWeight: '600' }
};

export default Signup;