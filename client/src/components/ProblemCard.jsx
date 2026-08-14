import React, { useState } from 'react';
import { Check, Star, ExternalLink, BookmarkCheck } from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const ProblemCard = ({ problem, onProgressUpdate, showTopic = false }) => {
  const [isSolved, setIsSolved] = useState(problem.is_solved);
  const [isBookmarked, setIsBookmarked] = useState(problem.is_bookmarked);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleToggleSolved = async (e) => {
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    const nextState = !isSolved;
    setIsSolved(nextState); // Optimistic UI update

    try {
      if (nextState) {
        await api.problems.complete(problem.id);
        toast.success(`✓ "${problem.title}" marked as solved`);
      } else {
        await api.problems.uncomplete(problem.id);
        toast.info(`"${problem.title}" marked as unsolved`);
      }

      if (onProgressUpdate) {
        onProgressUpdate(problem.id, nextState);
      }
    } catch (error) {
      // Revert on error
      setIsSolved(!nextState);
      toast.error(error.message || 'Failed to update problem status');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (e) => {
    e.stopPropagation();
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    try {
      if (nextState) {
        await api.problems.bookmark(problem.id);
        toast.success(`★ Added to bookmarks`);
      } else {
        await api.problems.unbookmark(problem.id);
        toast.info(`Removed from bookmarks`);
      }
    } catch (error) {
      setIsBookmarked(!nextState);
      toast.error(error.message || 'Failed to update bookmark');
    }
  };

  const difficultyClass = `badge badge-${problem.difficulty.toLowerCase()}`;

  return (
    <div className={`problem-card ${isSolved ? 'is-solved' : ''}`}>
      <div className="problem-left">
        <button
          type="button"
          onClick={handleToggleSolved}
          className={`custom-checkbox ${isSolved ? 'checked' : ''}`}
          aria-label={isSolved ? 'Mark unsolved' : 'Mark solved'}
          title={isSolved ? 'Mark as unsolved' : 'Mark as solved'}
          disabled={loading}
        >
          {isSolved && <Check size={14} strokeWidth={3} />}
        </button>

        <div className="problem-title-wrapper">
          <span className="problem-title" style={{ textDecoration: isSolved ? 'line-through' : 'none', opacity: isSolved ? 0.85 : 1 }}>
            {problem.title}
          </span>
          {showTopic && problem.topic && (
            <span className="problem-topic-tag">
              Topic: {problem.topic.name}
            </span>
          )}
        </div>
      </div>

      <div className="problem-right">
        <span className={difficultyClass}>
          {problem.difficulty}
        </span>

        {/* LeetCode link */}
        {problem.leetcode_url && (
          <a
            href={problem.leetcode_url}
            target="_blank"
            rel="noopener noreferrer"
            className="platform-btn platform-btn-leetcode"
            title="Solve on LeetCode"
          >
            LeetCode
            <ExternalLink size={12} />
          </a>
        )}

        {/* GeeksforGeeks link */}
        {problem.gfg_url && (
          <a
            href={problem.gfg_url}
            target="_blank"
            rel="noopener noreferrer"
            className="platform-btn platform-btn-gfg"
            title="Solve on GeeksforGeeks"
          >
            GFG
            <ExternalLink size={12} />
          </a>
        )}

        {/* Bookmark Button */}
        <button
          type="button"
          onClick={handleToggleBookmark}
          className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Problem'}
        >
          <Star
            size={18}
            fill={isBookmarked ? '#fbbf24' : 'none'}
            stroke={isBookmarked ? '#fbbf24' : 'currentColor'}
          />
        </button>
      </div>
    </div>
  );
};

export default ProblemCard;
