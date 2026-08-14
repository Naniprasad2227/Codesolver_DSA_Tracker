import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Filter,
  ArrowUpDown,
  BookOpen
} from 'lucide-react';
import api from '../services/api';
import ProblemCard from '../components/ProblemCard';
import ProgressBar from '../components/ProgressBar';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const TopicProblems = () => {
  const { topicSlug } = useParams();
  const [topic, setTopic] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters and sorting
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Roadmap');

  useEffect(() => {
    fetchTopicData();
  }, [topicSlug]);

  const fetchTopicData = async () => {
    try {
      setLoading(true);
      const [topicRes, problemsRes] = await Promise.all([
        api.topics.getById(topicSlug),
        api.problems.getByTopic(topicSlug)
      ]);

      setTopic(topicRes.topic);
      setProblems(problemsRes.problems || []);
    } catch (err) {
      console.error('Failed to load topic problems:', err);
    } finally {
      setLoading(false);
    }
  };

  // Live state callback when problem is checked/unchecked
  const handleProgressUpdate = (problemId, newSolvedState) => {
    // 1. Update problem item in local state
    setProblems((prev) =>
      prev.map((p) => (p.id === problemId ? { ...p, is_solved: newSolvedState } : p))
    );

    // 2. Update topic progress numbers locally
    setTopic((prev) => {
      if (!prev) return prev;
      const newSolvedCount = newSolvedState ? prev.solved_count + 1 : Math.max(0, prev.solved_count - 1);
      const newPercentage = prev.total_problems > 0 ? Math.round((newSolvedCount / prev.total_problems) * 100) : 0;
      return {
        ...prev,
        solved_count: newSolvedCount,
        percentage: newPercentage
      };
    });
  };

  // Client-side filtering & sorting
  const filteredProblems = useMemo(() => {
    let list = [...problems];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }

    // Difficulty
    if (difficultyFilter !== 'All') {
      list = list.filter((p) => p.difficulty === difficultyFilter);
    }

    // Status
    if (statusFilter === 'Solved') {
      list = list.filter((p) => p.is_solved);
    } else if (statusFilter === 'Unsolved') {
      list = list.filter((p) => !p.is_solved);
    }

    // Platform
    if (platformFilter === 'LeetCode') {
      list = list.filter((p) => !!p.leetcode_url);
    } else if (platformFilter === 'GFG') {
      list = list.filter((p) => !!p.gfg_url);
    }

    // Sort
    if (sortOrder === 'Alphabetical') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === 'EasyToHard') {
      const order = { Easy: 1, Medium: 2, Hard: 3 };
      list.sort((a, b) => (order[a.difficulty] || 0) - (order[b.difficulty] || 0));
    } else if (sortOrder === 'HardToEasy') {
      const order = { Easy: 1, Medium: 2, Hard: 3 };
      list.sort((a, b) => (order[b.difficulty] || 0) - (order[a.difficulty] || 0));
    } else if (sortOrder === 'SolvedFirst') {
      list.sort((a, b) => (b.is_solved === a.is_solved ? 0 : b.is_solved ? 1 : -1));
    } else if (sortOrder === 'UnsolvedFirst') {
      list.sort((a, b) => (a.is_solved === b.is_solved ? 0 : a.is_solved ? 1 : -1));
    } else {
      // Default roadmap order
      list.sort((a, b) => a.order_index - b.order_index);
    }

    return list;
  }, [problems, search, difficultyFilter, statusFilter, platformFilter, sortOrder]);

  if (loading) {
    return <Loader message="Loading topic problems..." />;
  }

  if (!topic) {
    return (
      <EmptyState
        title="Topic not found"
        description="The topic you requested does not exist or has been removed."
        action={
          <Link to="/roadmap" className="btn btn-primary">
            Back to Roadmap
          </Link>
        }
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Breadcrumb & Nav */}
      <div>
        <Link
          to="/roadmap"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '0.75rem', fontWeight: 500 }}
        >
          <ArrowLeft size={16} />
          <span>Back to Roadmap</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              {topic.name}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
              Solve problems on LeetCode or GFG, then mark them solved below.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
              {topic.solved_count} / {topic.total_problems} Solved
            </span>
            <div style={{ width: '160px', marginTop: '0.4rem' }}>
              <ProgressBar value={topic.solved_count} max={topic.total_problems} height={8} glow={topic.solved_count > 0} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="toolbar">
        <div className="search-input-wrapper">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search problems by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          {/* Difficulty */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            aria-label="Filter by difficulty"
          >
            <option value="All">Difficulty: All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by solved status"
          >
            <option value="All">Status: All</option>
            <option value="Solved">Solved</option>
            <option value="Unsolved">Unsolved</option>
          </select>

          {/* Platform */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            aria-label="Filter by platform"
          >
            <option value="All">Platform: All</option>
            <option value="LeetCode">LeetCode</option>
            <option value="GFG">GeeksforGeeks</option>
          </select>

          {/* Sort */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            aria-label="Sort problems"
          >
            <option value="Roadmap">Sort: Roadmap Order</option>
            <option value="Alphabetical">Alphabetical</option>
            <option value="EasyToHard">Easy → Hard</option>
            <option value="HardToEasy">Hard → Easy</option>
            <option value="SolvedFirst">Solved First</option>
            <option value="UnsolvedFirst">Unsolved First</option>
          </select>
        </div>
      </div>

      {/* Problems List */}
      {filteredProblems.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onProgressUpdate={handleProgressUpdate}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No problems found"
          description="No problems match your current search query and filters."
          action={
            <button
              onClick={() => {
                setSearch('');
                setDifficultyFilter('All');
                setStatusFilter('All');
                setPlatformFilter('All');
              }}
              className="btn btn-secondary"
            >
              Reset Filters
            </button>
          }
        />
      )}
    </div>
  );
};

export default TopicProblems;
