import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';

const RegisterComplaint = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const [formData, setFormData] = useState({
    name: '', email: '', title: '',
    description: '', category: '', location: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAIAnalyze = async () => {
    if (!formData.title || !formData.description) {
      return toast.warning('Please fill Title and Description first!');
    }
    setAiLoading(true);
    try {
      const res = await API.post('/ai/analyze', {
        title: formData.title,
        description: formData.description,
        category: formData.category
      });
      setAiResult(res.data.analysis);
      toast.success('AI Analysis complete! 🤖');
    } catch (err) {
      toast.error('AI Analysis failed!');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/complaints', formData);

      // Save AI result too if available
      if (aiResult) {
        await API.put(`/complaints/${res.data.complaint._id}/ai`, aiResult);
      }

      toast.success('Complaint registered successfully! ✅');
      navigate('/complaints');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register complaint!');
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = (priority) => {
    const map = { High: '#e74c3c', Medium: '#e67e22', Low: '#27ae60' };
    return map[priority] || '#999';
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📝 Register New Complaint</h1>
          <p style={styles.subtitle}>Fill in the details below to submit your complaint</p>
        </div>

        <div style={styles.mainGrid}>
          {/* Form */}
          <div style={styles.formCard}>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name *</label>
                  <input name="name" value={formData.name} onChange={handleChange}
                    placeholder="Enter your name" required style={styles.input} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email Address *</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange}
                    placeholder="Enter your email" required style={styles.input} />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Complaint Title *</label>
                <input name="title" value={formData.title} onChange={handleChange}
                  placeholder="Brief title of your complaint" required style={styles.input} />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange}
                  placeholder="Describe your complaint in detail..." required
                  rows={5} style={styles.textarea} />
              </div>

              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange}
                    required style={styles.select}>
                    <option value="">Select Category</option>
                    <option>Water Supply</option>
                    <option>Electricity</option>
                    <option>Roads</option>
                    <option>Garbage</option>
                    <option>Sanitation</option>
                    <option>Other</option>
                  </select>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Location *</label>
                  <input name="location" value={formData.location} onChange={handleChange}
                    placeholder="e.g. Ghaziabad, Sector 5" required style={styles.input} />
                </div>
              </div>

              {/* AI Analyze Button */}
              <button type="button" onClick={handleAIAnalyze}
                disabled={aiLoading} style={styles.aiBtn}>
                <FaRobot style={{ marginRight: 8 }} />
                {aiLoading ? 'Analyzing with AI...' : 'Analyze with AI 🤖'}
              </button>

              <button type="submit" disabled={loading} style={styles.submitBtn}>
                <FaPaperPlane style={{ marginRight: 8 }} />
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </form>
          </div>

          {/* AI Result Panel */}
          <div style={styles.aiPanel}>
            <h3 style={styles.aiPanelTitle}>🤖 AI Analysis Result</h3>
            {!aiResult ? (
              <div style={styles.aiEmpty}>
                <FaRobot size={50} color="#ddd" />
                <p style={{ color: '#bbb', marginTop: 14, fontSize: '14px', textAlign: 'center' }}>
                  Fill in the title & description, then click "Analyze with AI" to get instant insights
                </p>
              </div>
            ) : (
              <div style={styles.aiResult}>
                <div style={styles.aiItem}>
                  <span style={styles.aiLabel}>Priority</span>
                  <span style={{
                    ...styles.priorityBadge,
                    background: priorityColor(aiResult.priority)
                  }}>
                    {aiResult.priority}
                  </span>
                </div>
                <div style={styles.aiItem}>
                  <span style={styles.aiLabel}>Department</span>
                  <span style={styles.aiValue}>{aiResult.department}</span>
                </div>
                <div style={styles.aiDivider} />
                <div style={styles.aiItem}>
                  <span style={styles.aiLabel}>Summary</span>
                </div>
                <p style={styles.aiText}>{aiResult.summary}</p>
                <div style={styles.aiDivider} />
                <div style={styles.aiItem}>
                  <span style={styles.aiLabel}>Auto Response</span>
                </div>
                <p style={styles.aiText}>{aiResult.autoResponse}</p>
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
  header: { marginBottom: '24px' },
  title: { fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 },
  subtitle: { color: '#888', marginTop: '6px', fontSize: '14px' },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '24px',
    alignItems: 'start',
  },
  formCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#444' },
  input: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1.5px solid #e0e0e0',
    fontSize: '14px',
    outline: 'none',
    background: '#fafafa',
    transition: 'border 0.2s',
  },
  textarea: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1.5px solid #e0e0e0',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    background: '#fafafa',
    fontFamily: "'Segoe UI', sans-serif",
  },
  select: {
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1.5px solid #e0e0e0',
    fontSize: '14px',
    outline: 'none',
    background: '#fafafa',
    cursor: 'pointer',
  },
  aiBtn: {
    padding: '12px',
    background: 'linear-gradient(135deg, #8e44ad, #6c3483)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(142,68,173,0.3)',
  },
  submitBtn: {
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
    boxShadow: '0 4px 15px rgba(233,69,96,0.4)',
  },
  aiPanel: {
    background: '#fff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    position: 'sticky',
    top: '85px',
  },
  aiPanelTitle: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '2px solid #f0f0f0',
  },
  aiEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 10px',
  },
  aiResult: { display: 'flex', flexDirection: 'column', gap: '12px' },
  aiItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  aiLabel: { fontSize: '13px', fontWeight: '600', color: '#888' },
  aiValue: { fontSize: '14px', fontWeight: '600', color: '#1a1a2e' },
  priorityBadge: {
    padding: '4px 14px',
    borderRadius: '20px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '600',
  },
  aiDivider: { height: '1px', background: '#f0f0f0', margin: '4px 0' },
  aiText: { fontSize: '13px', color: '#555', lineHeight: 1.6, margin: 0 },
};

export default RegisterComplaint;