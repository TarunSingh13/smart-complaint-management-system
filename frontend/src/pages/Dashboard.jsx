import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import {
  FaClipboardList, FaCheckCircle, FaClock,
  FaExclamationTriangle, FaRobot, FaPlus
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0, pending: 0, inProgress: 0, resolved: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/complaints');
        const complaints = res.data.complaints;
        setRecentComplaints(complaints.slice(0, 5));
        setStats({
          total:      complaints.length,
          pending:    complaints.filter(c => c.status === 'Pending').length,
          inProgress: complaints.filter(c => c.status === 'In Progress').length,
          resolved:   complaints.filter(c => c.status === 'Resolved').length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Complaints', value: stats.total,      icon: <FaClipboardList />, color: '#0f3460' },
    { label: 'Pending',          value: stats.pending,    icon: <FaClock />,         color: '#e67e22' },
    { label: 'In Progress',      value: stats.inProgress, icon: <FaExclamationTriangle />, color: '#8e44ad' },
    { label: 'Resolved',         value: stats.resolved,   icon: <FaCheckCircle />,   color: '#27ae60' },
  ];

  const statusColor = (status) => {
    const map = {
      'Pending':     { bg: '#fff3cd', color: '#856404' },
      'In Progress': { bg: '#cce5ff', color: '#004085' },
      'Resolved':    { bg: '#d4edda', color: '#155724' },
      'Rejected':    { bg: '#f8d7da', color: '#721c24' },
    };
    return map[status] || { bg: '#eee', color: '#333' };
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>

        {/* Welcome Banner */}
        <div style={styles.banner}>
          <div>
            <h1 style={styles.bannerTitle}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p style={styles.bannerSubtitle}>
              Here's an overview of all complaints in the system
            </p>
          </div>
          <button
            style={styles.newComplaintBtn}
            onClick={() => navigate('/register-complaint')}
          >
            <FaPlus style={{ marginRight: 8 }} />
            New Complaint
          </button>
        </div>

        {/* Stat Cards */}
        {loading ? (
          <div style={styles.loadingText}>Loading dashboard...</div>
        ) : (
          <div style={styles.statsGrid}>
            {statCards.map((card, i) => (
              <div key={i} style={{ ...styles.statCard, borderTop: `4px solid ${card.color}` }}>
                <div style={{ ...styles.statIcon, background: card.color }}>
                  {card.icon}
                </div>
                <div>
                  <div style={styles.statValue}>{card.value}</div>
                  <div style={styles.statLabel}>{card.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.actionsGrid}>
            {[
              { label: 'Register Complaint', icon: '📝', path: '/register-complaint', color: '#e94560' },
              { label: 'View All Complaints', icon: '📋', path: '/complaints',         color: '#0f3460' },
              { label: 'AI Analysis',         icon: '🤖', path: '/ai-analysis',        color: '#8e44ad' },
            ].map((action, i) => (
              <div
                key={i}
                style={{ ...styles.actionCard, borderLeft: `4px solid ${action.color}` }}
                onClick={() => navigate(action.path)}
              >
                <span style={styles.actionIcon}>{action.icon}</span>
                <span style={styles.actionLabel}>{action.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Complaints */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Recent Complaints</h2>
          {recentComplaints.length === 0 ? (
            <div style={styles.emptyBox}>
              <FaRobot size={40} color="#ccc" />
              <p style={{ color: '#999', marginTop: 12 }}>No complaints yet. Register your first complaint!</p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentComplaints.map((c) => {
                    const sc = statusColor(c.status);
                    return (
                      <tr key={c._id} style={styles.tableRow}>
                        <td style={styles.td}>{c.title}</td>
                        <td style={styles.td}>{c.category}</td>
                        <td style={styles.td}>{c.location}</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.badge,
                            background: sc.bg,
                            color: sc.color
                          }}>
                            {c.status}
                          </span>
                        </td>
                        <td style={styles.td}>
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Segoe UI', sans-serif" },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' },
  banner: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
    borderRadius: '16px',
    padding: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  bannerTitle: { color: '#fff', fontSize: '26px', fontWeight: 'bold', margin: 0 },
  bannerSubtitle: { color: '#aaa', fontSize: '14px', marginTop: '6px' },
  newComplaintBtn: {
    background: 'linear-gradient(135deg, #e94560, #c0392b)',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '20px',
    flexShrink: 0,
  },
  statValue: { fontSize: '28px', fontWeight: 'bold', color: '#1a1a2e' },
  statLabel: { fontSize: '13px', color: '#888', marginTop: '2px' },
  loadingText: { textAlign: 'center', color: '#888', padding: '40px' },
  section: { marginBottom: '30px' },
  sectionTitle: { fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '16px' },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  actionCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s',
  },
  actionIcon: { fontSize: '28px' },
  actionLabel: { fontSize: '15px', fontWeight: '600', color: '#1a1a2e' },
  emptyBox: {
    background: '#fff',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  tableWrapper: {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    overflow: 'auto',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { background: '#f8f9fa' },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#555',
    borderBottom: '1px solid #eee',
  },
  tableRow: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#333' },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
};

export default Dashboard;