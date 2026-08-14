import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, CheckCircle, Award, Target, Flame, ArrowRight } from 'lucide-react';
import api from '../services/api';
import ProgressBar from '../components/ProgressBar';
import Loader from '../components/Loader';

const Progress = () => {
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
      console.error('Failed to load progress details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <Loader message="Analyzing your DSA progress..." />;
  }

  const { overall, difficulty, topics } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', marginBottom: '0.35rem' }}>
          <TrendingUp size={20} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Analytics & Mastery
          </span>
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          Detailed Progress
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
          Comprehensive statistics and difficulty distribution for your personal journey.
        </p>
      </div>

      {/* Main Overall Summary Hero Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #131627 0%, #0e1019 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)' }}>
              Overall Completion
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
              {overall.solved} <span style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {overall.total} Problems</span>
            </h2>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: overall.percentage > 0 ? '#10b981' : 'var(--text-muted)', lineHeight: 1 }}>
              {overall.percentage}%
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Roadmap Mastered</span>
          </div>
        </div>

        <ProgressBar value={overall.solved} max={overall.total} height={14} glow={overall.percentage > 0} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Remaining</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{overall.remaining} problems</div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Streak</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Flame size={18} />
              {overall.streak} Days
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Topics Completed</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
              {overall.topics_completed} / {overall.total_topics}
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown (Easy, Medium, Hard) */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
          Progress by Difficulty
        </h2>
        <div className="grid-3">
          {/* Easy Card */}
          <div className="card" style={{ borderLeft: '4px solid var(--easy)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <span className="badge badge-easy">Easy</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                {difficulty?.Easy?.solved || 0} / {difficulty?.Easy?.total || 0}
              </span>
            </div>
            <ProgressBar
              value={difficulty?.Easy?.solved || 0}
              max={difficulty?.Easy?.total || 1}
              height={8}
              color="var(--easy)"
            />
            <div style={{ marginTop: '0.65rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              {difficulty?.Easy?.total > 0 ? Math.round(((difficulty?.Easy?.solved || 0) / difficulty.Easy.total) * 100) : 0}% Solved
            </div>
          </div>

          {/* Medium Card */}
          <div className="card" style={{ borderLeft: '4px solid var(--medium)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <span className="badge badge-medium">Medium</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                {difficulty?.Medium?.solved || 0} / {difficulty?.Medium?.total || 0}
              </span>
            </div>
            <ProgressBar
              value={difficulty?.Medium?.solved || 0}
              max={difficulty?.Medium?.total || 1}
              height={8}
              color="var(--medium)"
            />
            <div style={{ marginTop: '0.65rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              {difficulty?.Medium?.total > 0 ? Math.round(((difficulty?.Medium?.solved || 0) / difficulty.Medium.total) * 100) : 0}% Solved
            </div>
          </div>

          {/* Hard Card */}
          <div className="card" style={{ borderLeft: '4px solid var(--hard)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <span className="badge badge-hard">Hard</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                {difficulty?.Hard?.solved || 0} / {difficulty?.Hard?.total || 0}
              </span>
            </div>
            <ProgressBar
              value={difficulty?.Hard?.solved || 0}
              max={difficulty?.Hard?.total || 1}
              height={8}
              color="var(--hard)"
            />
            <div style={{ marginTop: '0.65rem', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              {difficulty?.Hard?.total > 0 ? Math.round(((difficulty?.Hard?.solved || 0) / difficulty.Hard.total) * 100) : 0}% Solved
            </div>
          </div>
        </div>
      </div>

      {/* Topic Mastery List */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
          Topic Mastery Matrix
        </h2>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {topics?.map((topic, idx) => (
              <Link
                key={topic.id}
                to={`/topic/${topic.slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  borderBottom: idx < topics.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  textDecoration: 'none',
                  transition: 'background 0.2s ease',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: '180px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, width: '22px' }}>
                    #{topic.order_index}
                  </span>
                  <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                    {topic.name}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: '180px', maxWidth: '360px' }}>
                  <ProgressBar value={topic.solved} max={topic.total} height={6} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', minWidth: '140px', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <strong>{topic.solved}</strong> / {topic.total}
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, width: '45px', textAlign: 'right', color: topic.percentage === 100 ? 'var(--easy)' : topic.percentage > 0 ? '#fff' : 'var(--text-muted)' }}>
                    {topic.percentage}%
                  </span>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
