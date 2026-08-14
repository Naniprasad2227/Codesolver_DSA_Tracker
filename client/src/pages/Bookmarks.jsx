import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Star } from 'lucide-react';
import api from '../services/api';
import ProblemCard from '../components/ProblemCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await api.problems.getBookmarks();
      setBookmarks(res.problems || []);
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressUpdate = (problemId, newSolvedState) => {
    setBookmarks((prev) =>
      prev.map((p) => (p.id === problemId ? { ...p, is_solved: newSolvedState } : p))
    );
  };

  if (loading) {
    return <Loader message="Loading bookmarked problems..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fbbf24', marginBottom: '0.35rem' }}>
            <Bookmark size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Saved for later
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Bookmarks
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
            Keep track of tough questions, favorite patterns, or problems to revisit before interviews.
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Bookmarked: </span>
          <strong style={{ color: '#fbbf24' }}>{bookmarks.length}</strong>
        </div>
      </div>

      {/* Bookmarks List */}
      {bookmarks.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {bookmarks.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              showTopic={true}
              onProgressUpdate={handleProgressUpdate}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Star}
          title="No bookmarked problems yet"
          description="Click the star icon next to any problem to bookmark it for quick access here."
          action={
            <Link to="/problems" className="btn btn-primary">
              Browse Problems
            </Link>
          }
        />
      )}
    </div>
  );
};

export default Bookmarks;
