import React, { useState, useEffect, useMemo } from 'react';
import { Search, Code2 } from 'lucide-react';
import api from '../services/api';
import ProblemCard from '../components/ProblemCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const AllProblems = () => {
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters and sorting
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Roadmap');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [problemsRes, topicsRes] = await Promise.all([
        api.problems.getAll(),
        api.topics.getAll()
      ]);

      setProblems(problemsRes.problems || []);
      setTopics(topicsRes.topics || []);
    } catch (err) {
      console.error('Failed to load all problems:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressUpdate = (problemId, newSolvedState) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === problemId ? { ...p, is_solved: newSolvedState } : p))
    );
  };

  const filteredProblems = useMemo(() => {
    let list = [...problems];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }

    // Topic
    if (topicFilter !== 'All') {
      list = list.filter((p) => p.topic && (p.topic.slug === topicFilter || p.topic.name === topicFilter));
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
    }

    return list;
  }, [problems, search, topicFilter, difficultyFilter, statusFilter, platformFilter, sortOrder]);

  const solvedCount = problems.filter((p) => p.is_solved).length;

  if (loading) {
    return <Loader message="Loading problem repository..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', marginBottom: '0.35rem' }}>
            <Code2 size={20} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Problem Catalog
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            All DSA Problems
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
            Browse, filter, and track all DSA problems across every topic.
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Showing: </span>
          <strong style={{ color: '#fff' }}>{filteredProblems.length}</strong>
          <span style={{ color: 'var(--text-muted)' }}> / {problems.length}</span>
          <span style={{ marginLeft: '0.75rem', color: 'var(--easy)', fontWeight: 600 }}>({solvedCount} solved)</span>
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
          {/* Topic */}
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            aria-label="Filter by topic"
          >
            <option value="All">Topic: All</option>
            {topics.map((t) => (
              <option key={t.id} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>

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
            aria-label="Filter by status"
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
              showTopic={true}
              onProgressUpdate={handleProgressUpdate}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No problems found"
          description="Try adjusting your filters, topic selection, or search query."
          action={
            <button
              onClick={() => {
                setSearch('');
                setTopicFilter('All');
                setDifficultyFilter('All');
                setStatusFilter('All');
                setPlatformFilter('All');
              }}
              className="btn btn-secondary"
            >
              Clear All Filters
            </button>
          }
        />
      )}
    </div>
  );
};

export default AllProblems;
