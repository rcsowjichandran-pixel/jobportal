import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = 'http://127.0.0.1:8000/api';


function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', location: '', job_type: '' });
  const [submitted, setSubmitted] = useState(filters);

  useEffect(() => {
    let active = true;
    async function fetchJobs() {
      setLoading(true);
      setError('');
      try {
        const query = new URLSearchParams(Object.entries({ title: submitted.search, location: submitted.location, job_type: submitted.job_type }).filter(([, value]) => value));
        const response = await axios.get(`${API}/jobs/?${query}`);
        console.log("API Response:", response.data);
        console.log("Jobs being set:", response.data);
        if (active) setJobs(Array.isArray(response.data) ? response.data : response.data.results || []);
      } catch (err) {
        if (active) setError('We couldn’t load jobs right now. Check that the API server is running, then try again.');
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchJobs();
    return () => { active = false; };
  }, [submitted]);

  const visibleJobs = useMemo(() => jobs.filter((job) => {
    const query = submitted.search.trim().toLowerCase();
    return (!query || `${job.title} ${job.company} ${job.description}`.toLowerCase().includes(query))
      && (!submitted.location || (job.location || '').toLowerCase().includes(submitted.location.toLowerCase()))
      && (!submitted.job_type || job.job_type === submitted.job_type);
  }), [jobs, submitted]);

  function submitSearch(event) {
    event.preventDefault();
    setSubmitted(filters);
  }
console.log("Jobs State:", jobs);
console.log("Visible Jobs:", visibleJobs);

  return <>
    <section className="hero">
      <div><span className="eyebrow">A better kind of job search</span><h1>Find work that<br /><em>moves you forward.</em></h1><p className="hero-copy">Good work changes everything. Explore considered opportunities from teams building what comes next.</p></div>
      <div className="hero-stat"><strong>{loading ? '—' : `${visibleJobs.length}+`}</strong><span>opportunities to explore</span></div>
    </section>
    <form className="search-panel" onSubmit={submitSearch}>
      <label className="field-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg><input aria-label="Search roles or companies" placeholder="Role, skill or company" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /></label>
      <label className="field-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><input aria-label="Filter by location" placeholder="Anywhere" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} /></label>
      <label className="field-wrap"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12h18m-11 0v2h4v-2"/></svg><select aria-label="Filter by job type" value={filters.job_type} onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}><option value="">Any schedule</option><option>Full-time</option><option>Part-time</option><option>Contract</option></select></label>
      <button className="button" type="submit">Explore roles <span aria-hidden="true">→</span></button>
    </form>
    <div className="listing-top"><h2>Open opportunities</h2><span className="result-count">{loading ? 'Finding your next move…' : `${visibleJobs.length} roles`}</span></div>
    <section className="job-grid" aria-live="polite">
      {loading && <div className="loading-panel"><span className="spinner" />Loading opportunities…</div>}
      {!loading && error && <div className="error-panel" role="alert">{error}</div>}
      {!loading && !error && visibleJobs.length === 0 && <div className="empty-state"><strong>No roles match those filters yet.</strong><p style={{ marginTop: 8 }}>Try a different search or clear your filters.</p></div>}
      {!loading && !error && visibleJobs.map((job) => <article className="job-card" key={job.id}>
        <div className="job-card-top"><span className="company-mark">{(job.company || 'J').slice(0, 1).toUpperCase()}</span><span className="tag tag-accent">{job.job_type || 'Opportunity'}</span></div>
        <h3>{job.title}</h3><p className="company-name">{job.company}</p>
        <div className="job-meta"><span className="tag">⌖ {job.location}</span>{job.salary && <span className="tag">↗ {job.salary}</span>}</div>
        <div className="job-card-bottom"><span className="salary">{job.salary || 'Compensation discussed'}</span><Link className="text-link" to={`/jobs/${job.id}`}>View role <span aria-hidden="true">→</span></Link></div>
      </article>)}
    </section>
  </>;
}

export default JobList;
