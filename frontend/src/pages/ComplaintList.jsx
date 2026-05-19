import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { FaSearch, FaFilter, FaTrash, FaEdit, FaRobot } from 'react-icons/fa';

const ComplaintList = () => {
  const [complaints, setComplaints]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchLocation, setSearch]   = useState('');
  const [filterCategory, setFilter]   = useState('');
  const [editId, setEditId]           = useState(null);
  const [newStatus, setNewStatus]     = useState('');
  const [aiModal, setAiModal]         = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const url = filterCategory
        ? `/complaints?category=${filterCategory}`
        : '/complaints';
      const res = await API.get(url);
      setComplaints(res.data.complaints);
    } catch (err) {
      toast.error('Failed to fetch complaints!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, [filterCategory]);

  const handleSearch = async () => {
    if (!searchLocation.trim()) return fetchComplaints();
    try {
      const res = await API.get(`/complaints/search?location=${searchLocation}`);
      setComplaints(res.data.complaints);
    } catch {
      toast.error('Search failed!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this complaint?')) return;
    try {
      await API.delete(`/complaints/${id}`);
      toast.success('Complaint deleted!');
      fetchComplaints();
    } catch {
      toast.error('Delete failed!');
    }
  };

  const handleUpdateStatus = async (id) => {
    try {
      await API.put(`/complaints/${id}`, { status: newStatus });
      toast.success('Status updated!');
      setEditId(null);
      fetchComplaints();
    } catch {
      toast.error('Update failed!');
    }
  };

  const statusColor = (status) => {
    const map = {
      'Pending':     { bg: '#fff3cd', color: '#856404' },
      'In Progress': { bg: '#cce5ff', color: '#004085' },
      'Resolved':    { bg: '#d4edda', color: '#155724' },
      'Rejected':    { bg: '#f8d7da', color: '#721c24' },
    };
    return map[status] || { bg: '#eee', color: '#555' };
  };

  const priorityColor = (p) => {
    const map = { High: '#e74c3c', Medium: '#e67e22', Low: '#27ae60' };
    return map[p] || '#999';
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📋 All Complaints</h1>
          <p style={styles.subtitle}>View, filter, search and manage all complaints</p>
        </div>

        {/* Search & Filter Bar */}
        <div style={styles.toolbar}>
          <div style={styles.searchBox}>
            <FaSearch style={styles.searchIcon} />
            <input
              value={searchLocation}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by location..."
              style={styles.searchInput}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} style={styles.searchBtn}>Search</button>
          </div>

          <div style={styles.filterBox}>
            <FaFilter style={{ color: '#888', marginRight: 8 }} />
            <select
              value={filterCategory}
              onChange={(e) => setFilter(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="">All Categories</option>
              <option>Water Supply</option>
              <option>Electricity</option>
              <option>Roads</option>
              <option>Garbage</option>
              <option>Sanitation</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Complaints Table */}
        {loading ? (
          <div style={styles.loading}>Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div style={styles.empty}>No complaints found!</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Location</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>AI Priority</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c, i) => {
                  const sc = statusColor(c.status);
                  return (
                    <tr key={c._id} style={styles.tr}>
                      <td style={styles.td}>{i + 1}</td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>{c.email}</div>
                      </td>
                      <td style={styles.td}>{c.title}</td>
                      <td style={styles.td}>
                        <span style={styles.categoryBadge}>{c.category}</span>
                      </td>
                      <td style={styles.td}>{c.location}</td>
                      <td style={styles.td}>
                        {editId === c._id ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <select
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                              style={styles.statusSelect}
                            >
                              <option>Pending</option>
                              <option>In Progress</option>
                              <option>Resolved</option>
                              <option>Rejected</option>
                            </select>
                            <button
                              onClick={() => handleUpdateStatus(c._id)}
                              style={styles.saveBtn}
                            >✓</button>
                            <button
                              onClick={() => setEditId(null)}
                              style={styles.cancelBtn}
                            >✕</button>
                          </div>
                        ) : (
                          <span style={{ ...styles.badge, background: sc.bg, color: sc.color }}>
                            {c.status}
                          </span>
                        )}
                      </td>
                      <td style={styles.td}>
                        {c.aiAnalysis?.priority ? (
                          <span style={{
                            ...styles.priorityBadge,
                            background: priorityColor(c.aiAnalysis.priority)
                          }}>
                            {c.aiAnalysis.priority}
                          </span>
                        ) : <span style={{ color: '#ccc', fontSize: 13 }}>N/A</span>}
                      </td>
                      <td style={styles.td}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button
                            onClick={() => { setEditId(c._id); setNewStatus(c.status); }}
                            style={styles.editBtn} title="Update Status"
                          ><FaEdit /></button>
                          {c.aiAnalysis?.summary && (
                            <button
                              onClick={() => setAiModal(c)}
                              style={styles.aiBtn} title="View AI Analysis"
                            ><FaRobot /></button>
                          )}
                          <button
                            onClick={() => handleDelete(c._id)}
                            style={styles.deleteBtn} title="Delete"
                          ><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI Modal */}
      {aiModal && (
        <div style={styles.modalOverlay} onClick={() => setAiModal(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>🤖 AI Analysis — {aiModal.title}</h3>
            <div style={styles.modalGrid}>
              <div style={styles.modalItem}>
                <span style={styles.modalLabel}>Priority</span>
                <span style={{
                  ...styles.priorityBadge,
                  background: priorityColor(aiModal.aiAnalysis?.priority)
                }}>
                  {aiModal.aiAnalysis?.priority}
                </span>
              </div>
              <div style={styles.modalItem}>
                <span style={styles.modalLabel}>Department</span>
                <span style={styles.modalValue}>{aiModal.aiAnalysis?.department}</span>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <span style={styles.modalLabel}>Summary</span>
                <p style={styles.modalText}>{aiModal.aiAnalysis?.summary}</p>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <span style={styles.modalLabel}>Auto Response</span>
                <p style={styles.modalText}>{aiModal.aiAnalysis?.autoResponse}</p>
              </div>
            </div>
            <button onClick={() => setAiModal(null)} style={styles.closeBtn}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Segoe UI', sans-serif" },
  container: { maxWidth: '1300px', margin: '0 auto', padding: '30px 20px' },
  header: { marginBottom: '24px' },
  title: { fontSize: '26px', fontWeight: 'bold', color: '#1a1a2e', margin: 0 },
  subtitle: { color: '#888', fontSize: '14px', marginTop: 6 },
  toolbar: {
    display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap'
  },
  searchBox: {
    display: 'flex', alignItems: 'center', background: '#fff',
    borderRadius: '10px', padding: '8px 14px', flex: 1, minWidth: '260px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', gap: '8px',
  },
  searchIcon: { color: '#bbb' },
  searchInput: {
    flex: 1, border: 'none', outline: 'none', fontSize: '14px', background: 'transparent'
  },
  searchBtn: {
    background: 'linear-gradient(135deg, #e94560, #c0392b)',
    color: '#fff', border: 'none', padding: '8px 18px',
    borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
  },
  filterBox: {
    display: 'flex', alignItems: 'center', background: '#fff',
    borderRadius: '10px', padding: '8px 14px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  filterSelect: {
    border: 'none', outline: 'none', fontSize: '14px',
    background: 'transparent', cursor: 'pointer',
  },
  loading: { textAlign: 'center', color: '#888', padding: 40 },
  empty: {
    textAlign: 'center', color: '#999', padding: 60,
    background: '#fff', borderRadius: 16,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  tableWrapper: {
    background: '#fff', borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflowX: 'auto',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8f9fa' },
  th: {
    padding: '14px 16px', textAlign: 'left',
    fontSize: '12px', fontWeight: '700', color: '#555',
    borderBottom: '1px solid #eee', textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  tr: { borderBottom: '1px solid #f5f5f5', transition: 'background 0.2s' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#333' },
  badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 },
  categoryBadge: {
    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
    background: '#e8f4fd', color: '#0f3460',
  },
  priorityBadge: {
    padding: '4px 12px', borderRadius: '20px',
    color: '#fff', fontSize: '12px', fontWeight: 600,
  },
  actions: { display: 'flex', gap: '8px' },
  editBtn: {
    background: '#e8f4fd', color: '#0f3460', border: 'none',
    padding: '7px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
  },
  aiBtn: {
    background: '#f3e8fd', color: '#8e44ad', border: 'none',
    padding: '7px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
  },
  deleteBtn: {
    background: '#fde8e8', color: '#e74c3c', border: 'none',
    padding: '7px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
  },
  statusSelect: {
    padding: '6px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px',
  },
  saveBtn: {
    background: '#27ae60', color: '#fff', border: 'none',
    padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700,
  },
  cancelBtn: {
    background: '#e74c3c', color: '#fff', border: 'none',
    padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700,
  },
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
  },
  modal: {
    background: '#fff', borderRadius: '16px', padding: '30px',
    width: '90%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  modalTitle: { fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '20px' },
  modalGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' },
  modalItem: { display: 'flex', flexDirection: 'column', gap: '6px' },
  modalLabel: { fontSize: '12px', fontWeight: 700, color: '#888', textTransform: 'uppercase' },
  modalValue: { fontSize: '15px', fontWeight: 600, color: '#1a1a2e' },
  modalText: { fontSize: '14px', color: '#555', lineHeight: 1.6, marginTop: '6px' },
  closeBtn: {
    width: '100%', padding: '12px',
    background: 'linear-gradient(135deg, #1a1a2e, #0f3460)',
    color: '#fff', border: 'none', borderRadius: '10px',
    cursor: 'pointer', fontSize: '15px', fontWeight: 600,
  },
};

export default ComplaintList;