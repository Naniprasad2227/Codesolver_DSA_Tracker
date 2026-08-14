import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  CheckCircle,
  Clock,
  Award,
  Bookmark,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await api.progress.getOverall();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard progress:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <Loader message="Loading your dashboard..." />;
  }

  const { overall, topics, recent_solved, difficulty } = data;
  const isNewUser = overall.solved === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Welcome Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Hello, {user?.name || 'Developer'} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
            {isNewUser ? 'Your DSA journey starts today at 0%.' : 'Keep the momentum going! Pick up where you left off.'}
          </p>
        </div>

        <Link to="/roadmap" className="btn btn-primary">
          <span>View Roadmap</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Zero State Onboarding Banner for New Users */}
      {isNewUser && (
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(16, 185, 129, 0.08))',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '1.5rem 1.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Welcome to CodeSolver!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.15rem' }}>
                Your progress starts completely fresh. Pick a topic like <strong>Arrays</strong>, solve on LeetCode or GFG, and tick it off!
              </p>
            </div>
          </div>
          <Link to="/roadmap" className="btn btn-primary" style={{ background: '#10b981', boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)' }}>
            Start Solving →
          </Link>
        </div>
      )}

      {/* Hero Progress Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(180deg, #151828 0%, #10121d 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          padding: '1.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)' }}>
              DSA Progress Overview
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>
              {overall.solved} / {overall.total} Solved
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: overall.percentage > 0 ? '#10b981' : 'var(--text-muted)' }}>
              {overall.percentage}%
            </span>
          </div>
        </div>

        <ProgressBar value={overall.solved} max={overall.total} height={12} glow={overall.percentage > 0} />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={16} color="var(--easy)" />
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <strong>{overall.solved}</strong> Solved
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <strong>{overall.remaining}</strong> Remaining
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Flame size={16} color={overall.streak > 0 ? '#f59e0b' : 'var(--text-muted)'} />
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <strong>{overall.streak}</strong> Day Streak
            </span>
          </div>
        </div>
      </div>

      {/* Stat Cards 4-Grid */}
      <div className="grid-4">
        <StatCard
          title="Total Solved"
          value={overall.solved}
          subtitle={`out of ${overall.total}`}
          icon={CheckCircle}
          color="var(--easy)"
        />
        <StatCard
          title="Remaining"
          value={overall.remaining}
          subtitle="problems left"
          icon={Clock}
          color="var(--medium)"
        />
        <StatCard
          title="Current Streak"
          value={`${overall.streak} Days`}
          subtitle="keep it alive!"
          icon={Flame}
          color="#f59e0b"
        />
        <StatCard
          title="Topics Completed"
          value={`${overall.topics_completed} / ${overall.total_topics}`}
          subtitle="100% finished"
          icon={Award}
          color="var(--primary)"
        />
      </div>

      {/* Split Section: Recent Solved + Difficulty Breakdown */}
      <div className="grid-2">
        {/* Difficulty Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', color: '#fff' }}>
            Difficulty Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Easy */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-easy">Easy</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {difficulty?.Easy?.solved || 0} / {difficulty?.Easy?.total || 0}
                </span>
              </div>
              <ProgressBar
                value={difficulty?.Easy?.solved || 0}
                max={difficulty?.Easy?.total || 1}
                color="var(--easy)"
              />
            </div>

            {/* Medium */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-medium">Medium</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {difficulty?.Medium?.solved || 0} / {difficulty?.Medium?.total || 0}
                </span>
              </div>
              <ProgressBar
                value={difficulty?.Medium?.solved || 0}
                max={difficulty?.Medium?.total || 1}
                color="var(--medium)"
              />
            </div>

            {/* Hard */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-hard">Hard</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {difficulty?.Hard?.solved || 0} / {difficulty?.Hard?.total || 0}
                </span>
              </div>
              <ProgressBar
                value={difficulty?.Hard?.solved || 0}
                max={difficulty?.Hard?.total || 1}
                color="var(--hard)"
              />
            </div>
          </div>
        </div>

        {/* Recent Solved Activity */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
              Recently Solved
            </h3>
            <Link to="/problems" style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
              All Problems →
            </Link>
          </div>

          {recent_solved && recent_solved.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recent_solved.map((prob) => (
                <div
                  key={prob.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: 'var(--bg-card-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <CheckCircle size={15} color="var(--easy)" />
                    <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{prob.title}</span>
                  </div>
                  <span className={`badge badge-${prob.difficulty?.toLowerCase()}`}>
                    {prob.difficulty}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              <Clock size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p>No solved problems yet.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>Mark problems as solved to populate your activity!</p>
            </div>
          )}
        </div>
      </div>

      {/* Topic-Wise Progress Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
              Topic-Wise Progress
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Select any topic to view its roadmap problems.
            </p>
          </div>
          <Link to="/roadmap" style={{ fontSize: '0.88rem', color: 'var(--primary)', fontWeight: 600 }}>
            View Full Roadmap →
          </Link>
        </div>

        <div className="grid-3">
          {topics?.slice(0, 9).map((topic) => (
            <Link
              key={topic.id}
              to={`/topic/${topic.slug}`}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                textDecoration: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff' }}>
                  {topic.name}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: topic.percentage === 100 ? 'var(--easy)' : 'var(--text-secondary)' }}>
                  {topic.percentage}%
                </span>
              </div>

              <ProgressBar value={topic.solved} max={topic.total} />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>{topic.solved} / {topic.total} solved</span>
                <span>{Math.max(0, topic.total - topic.solved)} left</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
