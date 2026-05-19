import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { FaRobot, FaBolt, FaBuilding, FaAlignLeft, FaReply } from 'react-icons/fa';

const AIAnalysis = () => {
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      return toast.warning('Title and Description are required!');
    }
    setLoading(true);
    try {
      const res = await API.post('/ai/analyze', form);
      setResult(res.data.analysis);
      setHistory((prev) => [
        { ...form, analysis: res.data.analysis, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 4)
      ]);
      toast.success('AI Analysis complete! 🤖');
    } catch (err) {
      toast.error('AI Analysis failed!');
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = (p) => {
    const map = { High: '#e74c3c', Medium: '#e67e22', Low: '#27ae60' };
    return map[p] || '#999';
  };

  const resultCards = result ? [
    {
      icon: <FaBolt size={22} />,
      label: 'Priority Level',
      value: result.priority,
      color: priorityColor(result.priority),
      isBadge: true,
    },
    {
      icon: <FaBuilding size={22} />,
      label: 'Responsible Department',
      value: result.department,
      color: '#0f3460',
      isBadge: false,
    },
    {
      icon: <FaAlignLeft size={22} />,
      label: 'AI Summary',
      value: result.summary,
      color: '#8e44ad',
      isBadge: false,
    },
    {
      icon: <FaReply size={22} />,
      label: 'Auto Response',
      value: result.autoResponse,
      color: '#27ae60',
      isBadge: false,
    },
  ] : [];

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.heroBanner}>
          <div style={styles.heroLeft}>
            <FaRobot size={48} color="#e94560" />
            <div style={{ marginLeft: 20 }}>
              <h1 style={styles.heroTitle}>AI Complaint Analyzer</h1>
              <p style={styles.heroSubtitle}>
                Paste any complaint to get instant AI-powered insights — priority, department, summary & auto-response
              </p>
            </div>
          </div>
        </div>

        <div style={styles.mainGrid}>
          {/* Left - Form */}
          <div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Enter Complaint Details</h3>
              <form onSubmit={handleAnalyze} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Complaint Title *</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Water leakage near market area"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Category</label>
                  <select name="category" value={form.category}
                    onChange={handleChange} style={styles.select}>
                    <option value="">Select Category (Optional)</option>
                    <option>Water Supply</option>
                    <option>Electricity</option>
                    <option>Roads</option>
                    <option>Garbage</option>
                    <option>Sanitation</option>
                    <option>Other</option>
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Complaint Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the complaint in detail..."
                    rows={6}
                    style={styles.textarea}
                    required
                  />
                </div>

                <button type="submit" disabled={loading} style={styles.analyzeBtn}>
                  <FaRobot style={{ marginRight: 8 }} />
                  {loading ? 'Analyzing...' : 'Analyze with AI'}
                </button>
              </form>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div style={{ ...styles.card, marginTop: 20 }}>
                <h3 style={styles.cardTitle}>Recent Analyses</h3>
                {history.map((h, i) => (
                  <div key={i} style={styles.historyItem}>
                    <div style={styles.historyTop}>
                      <span style={styles.historyTitle}>{h.title}</span>
                      <span style={styles.historyTime}>{h.time}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                      <span style={{
                        ...styles.miniPriority,
                        background: priorityColor(h.analysis.priority)
                      }}>
                        {h.analysis.priority}
                      </span>
                      <span style={styles.miniDept}>{h.analysis.department}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right - Results */}
          <div>
            {!result ? (
              <div style={styles.emptyResult}>
                <FaRobot size={60} color="#e0e0e0" />
                <h3 style={{ color: '#ccc', marginTop: 16 }}>No Analysis Yet</h3>
                <p style={{ color: '#bbb', fontSize: 14, textAlign: 'center', maxWidth: 260 }}>
                  Enter complaint details on the left and click "Analyze with AI"
                </p>
              </div>
            ) : (
              <div style={styles.resultsContainer}>
                <h3 style={styles.resultHeader}>
                  🤖 Analysis Results
                  <span style={styles.resultBadge}>AI Generated</span>
                </h3>
                {resultCards.map((card, i) => (
                  <div key={i} style={{ ...styles.resultCard, borderLeft: `4px solid ${card.color}` }}>
                    <div style={{ ...styles.resultIcon, background: card.color + '20', color: card.color }}>
                      {card.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={styles.resultLabel}>{card.label}</div>
                      {card.isBadge ? (
                        <span style={{ ...styles.priorityBig, background: card.color }}>
                          {card.value}
                        </span>
                      ) : (
                        <div style={styles.resultValue}>{card.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Segoe UI', sans-serif" },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' },
  heroBanner: {
    background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
    borderRadius: '16px', padding: '28px 30px',
    display: 'flex', alignItems: 'center', marginBottom: '28px',
  },
  heroLeft: { display: 'flex', alignItems: 'center' },
  heroTitle: { fontSize: '26px', fontWeight: 'bold', color: '#fff', margin: 0 },
  heroSubtitle: { color: '#aaa', fontSize: '14px', marginTop: 6, maxWidth: 500 },
  mainGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start',
  },
  card: {
    background: '#fff', borderRadius: '16px', padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  cardTitle: { fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#555' },
  input: {
    padding: '12px 14px', borderRadius: '10px',
    border: '1.5px solid #e0e0e0', fontSize: '14px',
    outline: 'none', background: '#fafafa',
  },
  select: {
    padding: '12px 14px', borderRadius: '10px',
    border: '1.5px solid #e0e0e0', fontSize: '14px',
    outline: 'none', background: '#fafafa', cursor: 'pointer',
  },
  textarea: {
    padding: '12px 14px', borderRadius: '10px',
    border: '1.5px solid #e0e0e0', fontSize: '14px',
    outline: 'none', resize: 'vertical', background: '#fafafa',
    fontFamily: "'Segoe UI', sans-serif",
  },
  analyzeBtn: {
    padding: '13px', background: 'linear-gradient(135deg, #8e44ad, #6c3483)',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(142,68,173,0.3)',
  },
  historyItem: {
    padding: '14px', borderRadius: '10px',
    background: '#f8f9fa', marginBottom: '10px',
  },
  historyTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  historyTitle: { fontSize: '14px', fontWeight: 600, color: '#333' },
  historyTime: { fontSize: '12px', color: '#999' },
  miniPriority: {
    padding: '3px 10px', borderRadius: '20px',
    color: '#fff', fontSize: '12px', fontWeight: 600,
  },
  miniDept: {
    padding: '3px 10px', borderRadius: '20px',
    background: '#e8f4fd', color: '#0f3460', fontSize: '12px', fontWeight: 600,
  },
  emptyResult: {
    background: '#fff', borderRadius: '16px', padding: '60px 30px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  resultsContainer: {
    background: '#fff', borderRadius: '16px', padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  resultHeader: {
    fontSize: '17px', fontWeight: 'bold', color: '#1a1a2e',
    marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px',
  },
  resultBadge: {
    fontSize: '11px', background: '#8e44ad', color: '#fff',
    padding: '3px 10px', borderRadius: '20px', fontWeight: 600,
  },
  resultCard: {
    display: 'flex', alignItems: 'flex-start', gap: '16px',
    padding: '16px', borderRadius: '12px',
    background: '#fafafa', marginBottom: '14px',
  },
  resultIcon: {
    width: '44px', height: '44px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  resultLabel: { fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', marginBottom: 6 },
  resultValue: { fontSize: '15px', color: '#333', lineHeight: 1.5 },
  priorityBig: {
    display: 'inline-block', padding: '6px 18px',
    borderRadius: '20px', color: '#fff', fontSize: '14px', fontWeight: 700,
  },
};

export default AIAnalysis;