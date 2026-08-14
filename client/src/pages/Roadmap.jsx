import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Map, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import api from '../services/api';
import ProgressBar from '../components/ProgressBar';
import Loader from '../components/Loader';

const Roadmap = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      const res = await api.topics.getAll();
      setTopics(res.topics || []);
    } catch (err) {
      console.error('Failed to load topics roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading DSA Roadmap..." />;
  }

  const totalProblems = topics.reduce((acc, t) => acc + (t.total_problems || 0), 0);
  const totalSolved = topics.reduce((acc, t) => acc + (t.solved_count || 0), 0);
  const overallPercentage = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', marginBottom: '0.35rem' }}>
          <Map size={20} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Curated Curriculum
          </span>
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          DSA Roadmap
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
          Step-by-step topic roadmap covering fundamental to advanced data structures and algorithms.
        </p>
      </div>

      {/* Progress banner */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', background: 'linear-gradient(90deg, #131625, #10121d)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <span style={{ fontWeight: 600, color: '#fff' }}>Roadmap Progress</span>
            <span style={{ fontWeight: 700, color: 'var(--easy)' }}>{totalSolved} / {totalProblems} Solved ({overallPercentage}%)</span>
          </div>
          <ProgressBar value={totalSolved} max={totalProblems} height={10} glow={totalSolved > 0} />
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid-3">
        {topics.map((topic, index) => {
          const isCompleted = topic.total_problems > 0 && topic.solved_count >= topic.total_problems;

          return (
            <Link
              key={topic.id}
              to={`/topic/${topic.slug}`}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden',
                borderLeft: isCompleted ? '4px solid var(--easy)' : undefined
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--bg-card-secondary)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {index + 1}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>
                    {topic.name}
                  </h3>
                </div>

                {isCompleted ? (
                  <CheckCircle2 size={18} color="var(--easy)" />
                ) : (
                  <ChevronRight size={18} color="var(--text-muted)" />
                )}
              </div>

              <ProgressBar value={topic.solved_count} max={topic.total_problems} height={6} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <span>
                  <strong>{topic.solved_count}</strong> / {topic.total_problems} solved
                </span>
                <span style={{ fontWeight: 600, color: topic.percentage > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {topic.percentage}%
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;
