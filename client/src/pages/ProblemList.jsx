import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');

  useEffect(() => {
    api.get('/problems')
      .then((res) => {
        setProblems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = problems.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(q) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(q));
    const matchesDifficulty = difficulty === 'All' || p.difficulty === difficulty;
    return matchesSearch && matchesDifficulty;
  });

  if (loading) return <p>Loading problems...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Problems</h1>

      <div className="filters">
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="All">All difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>No problems match your search.</p>
      ) : (
        <ul className="problem-list">
          {filtered.map((problem) => (
            <li key={problem._id}>
              <Link to={`/problems/${problem._id}`}>{problem.title}</Link>
              <span className={`badge ${problem.difficulty}`}>{problem.difficulty}</span>
              {(problem.tags || []).map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProblemList;