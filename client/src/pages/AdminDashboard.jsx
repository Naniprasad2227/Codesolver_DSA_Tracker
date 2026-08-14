import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  Code2,
  CheckCircle2,
  TrendingUp,
  Trash2,
  Edit3,
  Plus,
  Search,
  Award,
  ExternalLink,
  X,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & filter for problem management
  const [problemSearch, setProblemSearch] = useState('');
  const [problemTopicFilter, setProblemTopicFilter] = useState('All');
  const [problemDiffFilter, setProblemDiffFilter] = useState('All');

  // Modal state for Add/Edit Problem
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    topic_id: '',
    difficulty: 'Easy',
    leetcode_url: '',
    gfg_url: ''
  });

  const toast = useToast();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, problemsRes, topicsRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getUsers(),
        api.problems.getAll(),
        api.topics.getAll()
      ]);

      setStats(statsRes);
      setUsers(usersRes.users || []);
      setProblems(problemsRes.problems || []);
      setTopics(topicsRes.topics || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      toast.error('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // User Actions
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}" and all their progress? This cannot be undone.`)) {
      return;
    }

    try {
      await api.admin.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success(`User "${userName}" deleted successfully`);
      // Refresh stats
      const updatedStats = await api.admin.getStats();
      setStats(updatedStats);
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.admin.updateUserRole(userId, nextRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: nextRole } : u));
      toast.success(`User role updated to ${nextRole}`);
    } catch (err) {
      toast.error(err.message || 'Failed to update user role');
    }
  };

  // Problem Actions
  const handleOpenAddProblem = () => {
    setEditingProblem(null);
    setFormData({
      title: '',
      topic_id: topics[0]?.id || '',
      difficulty: 'Easy',
      leetcode_url: '',
      gfg_url: ''
    });
    setIsProblemModalOpen(true);
  };

  const handleOpenEditProblem = (prob) => {
    setEditingProblem(prob);
    setFormData({
      title: prob.title,
      topic_id: prob.topic?.id || topics[0]?.id || '',
      difficulty: prob.difficulty,
      leetcode_url: prob.leetcode_url || '',
      gfg_url: prob.gfg_url || ''
    });
    setIsProblemModalOpen(true);
  };

  const handleSaveProblem = async (e) => {
    e.preventDefault();
    try {
      if (editingProblem) {
        // Update
        const res = await api.admin.updateProblem(editingProblem.id, formData);
        setProblems(prev => prev.map(p => p.id === editingProblem.id ? { ...p, ...res.problem, topic: topics.find(t => t.id === formData.topic_id) } : p));
        toast.success(`Problem "${formData.title}" updated`);
      } else {
        // Create
        const res = await api.admin.createProblem(formData);
        const newProb = {
          ...res.problem,
          id: res.problem._id,
          topic: topics.find(t => t.id === formData.topic_id),
          is_solved: false,
          is_bookmarked: false
        };
        setProblems(prev => [newProb, ...prev]);
        toast.success(`Problem "${formData.title}" added to catalog`);
      }
      setIsProblemModalOpen(false);
      // Refresh stats
      const updatedStats = await api.admin.getStats();
      setStats(updatedStats);
    } catch (err) {
      toast.error(err.message || 'Failed to save problem');
    }
  };

  const handleDeleteProblem = async (problemId, problemTitle) => {
    if (!window.confirm(`Are you sure you want to delete problem "${problemTitle}" from the global catalog?`)) {
      return;
    }

    try {
      await api.admin.deleteProblem(problemId);
      setProblems(prev => prev.filter(p => p.id !== problemId));
      toast.success(`Problem "${problemTitle}" deleted`);
      // Refresh stats
      const updatedStats = await api.admin.getStats();
      setStats(updatedStats);
    } catch (err) {
      toast.error(err.message || 'Failed to delete problem');
    }
  };

  // Filtered problems list in problem management tab
  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(problemSearch.toLowerCase());
    const matchesTopic = problemTopicFilter === 'All' || (p.topic && (p.topic.id === problemTopicFilter || p.topic.slug === problemTopicFilter));
    const matchesDiff = problemDiffFilter === 'All' || p.difficulty === problemDiffFilter;
    return matchesSearch && matchesTopic && matchesDiff;
  });

  if (loading || !stats) {
    return <Loader message="Loading Admin Management Portal..." />;
  }

  const { metrics, recent_users, top_solved_problems } = stats;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Admin Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f59e0b', marginBottom: '0.35rem' }}>
            <Shield size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Administration Console
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
            Manage platform users, monitor global problem solves, and curate the DSA catalog.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/dashboard" className="btn btn-secondary">
            Switch to User View
          </Link>
          <button onClick={handleOpenAddProblem} className="btn btn-primary">
            <Plus size={16} />
            <span>Add New Problem</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1rem', fontSize: '0.88rem' }}
        >
          <TrendingUp size={16} />
          <span>Platform Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1rem', fontSize: '0.88rem' }}
        >
          <Users size={16} />
          <span>User Management ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('problems')}
          className={`btn ${activeTab === 'problems' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.5rem 1rem', fontSize: '0.88rem' }}
        >
          <Code2 size={16} />
          <span>Problem Catalog ({problems.length})</span>
        </button>
      </div>

      {/* Global Stat Cards Grid */}
      <div className="grid-4">
        <StatCard
          title="Total Registered Users"
          value={metrics.total_users}
          subtitle="accounts"
          icon={Users}
          color="var(--primary)"
        />
        <StatCard
          title="Total Problems in Catalog"
          value={metrics.total_problems}
          subtitle={`across ${metrics.total_topics} topics`}
          icon={Code2}
          color="#06b6d4"
        />
        <StatCard
          title="Global Solves Recorded"
          value={metrics.total_solves}
          subtitle="across all users"
          icon={CheckCircle2}
          color="var(--easy)"
        />
        <StatCard
          title="Avg Solves per User"
          value={metrics.avg_solves_per_user}
          subtitle="problems/user"
          icon={Award}
          color="#f59e0b"
        />
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid-2">
          {/* Top Solved Problems */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
              Most Solved Problems
            </h3>
            {top_solved_problems && top_solved_problems.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {top_solved_problems.map((prob, idx) => (
                  <div
                    key={prob.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: 'var(--bg-card-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', width: '20px' }}>
                        #{idx + 1}
                      </span>
                      <span style={{ fontSize: '0.92rem', fontWeight: 500, color: '#fff' }}>
                        {prob.title}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className={`badge badge-${prob.difficulty?.toLowerCase()}`}>
                        {prob.difficulty}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--easy)' }}>
                        {prob.solves} solves
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No solves recorded yet.</p>
            )}
          </div>

          {/* Recent User Registrations */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
              Recent User Registrations
            </h3>
            {recent_users && recent_users.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recent_users.map(u => (
                  <div
                    key={u._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: 'var(--bg-card-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff' }}>{u.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-hard' : 'badge-easy'}`}>
                        {u.role || 'user'}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No users registered yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: User Management */}
      {activeTab === 'users' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              Registered Platform Users
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Total: {users.length}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-card-secondary)', borderBottom: '1px solid var(--border-card)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Name</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Email</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Role</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Problems Solved</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Joined Date</th>
                  <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#fff' }}>{u.name}</td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-hard' : 'badge-easy'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-primary)' }}>
                      <strong>{u.solved_count}</strong> / {metrics.total_problems}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleToggleRole(u.id, u.role)}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                          title="Toggle Admin/User role"
                        >
                          {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="btn btn-danger"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                          title="Delete user"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Problem Management */}
      {activeTab === 'problems' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Toolbar */}
          <div className="toolbar">
            <div className="search-input-wrapper">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search problem catalog..."
                value={problemSearch}
                onChange={(e) => setProblemSearch(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                value={problemTopicFilter}
                onChange={(e) => setProblemTopicFilter(e.target.value)}
              >
                <option value="All">Topic: All</option>
                {topics.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>

              <select
                value={problemDiffFilter}
                onChange={(e) => setProblemDiffFilter(e.target.value)}
              >
                <option value="All">Difficulty: All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <button onClick={handleOpenAddProblem} className="btn btn-primary">
                <Plus size={16} />
                <span>Add Problem</span>
              </button>
            </div>
          </div>

          {/* Problem Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card-secondary)', borderBottom: '1px solid var(--border-card)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Title</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Topic</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Difficulty</th>
                    <th style={{ padding: '0.85rem 1.25rem' }}>External Links</th>
                    <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProblems.map(prob => (
                    <tr key={prob.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#fff' }}>{prob.title}</td>
                      <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                        {prob.topic?.name || 'Unassigned'}
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span className={`badge badge-${prob.difficulty?.toLowerCase()}`}>
                          {prob.difficulty}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {prob.leetcode_url && (
                            <a href={prob.leetcode_url} target="_blank" rel="noopener noreferrer" className="platform-btn platform-btn-leetcode" style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}>
                              LC <ExternalLink size={10} />
                            </a>
                          )}
                          {prob.gfg_url && (
                            <a href={prob.gfg_url} target="_blank" rel="noopener noreferrer" className="platform-btn platform-btn-gfg" style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}>
                              GFG <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleOpenEditProblem(prob)}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.65rem' }}
                            title="Edit Problem"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProblem(prob.id, prob.title)}
                            className="btn btn-danger"
                            style={{ padding: '0.35rem 0.65rem' }}
                            title="Delete Problem"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Problem Modal */}
      {isProblemModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                {editingProblem ? 'Edit Problem' : 'Add New Problem'}
              </h2>
              <button onClick={() => setIsProblemModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProblem} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Problem Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Trapping Rain Water"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    DSA Topic *
                  </label>
                  <select
                    value={formData.topic_id}
                    onChange={(e) => setFormData({ ...formData, topic_id: e.target.value })}
                    style={{ width: '100%' }}
                    required
                  >
                    {topics.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  LeetCode URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.leetcode_url}
                  onChange={(e) => setFormData({ ...formData, leetcode_url: e.target.value })}
                  placeholder="https://leetcode.com/problems/..."
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  GeeksforGeeks URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.gfg_url}
                  onChange={(e) => setFormData({ ...formData, gfg_url: e.target.value })}
                  placeholder="https://www.geeksforgeeks.org/problems/..."
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsProblemModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProblem ? 'Save Changes' : 'Create Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
