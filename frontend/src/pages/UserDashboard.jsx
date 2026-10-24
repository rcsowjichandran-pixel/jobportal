import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function UserDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    async function loadApplications() {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) { navigate('/login', { replace: true }); return; }
        const response = await axios.get('http://localhost:8000/api/my-applications/', { headers: { Authorization: `Bearer ${token}` } });
        if (active) setApplications(Array.isArray(response.data) ? response.data : response.data.results || []);
      } catch (err) {
        if (active) setError(err.response?.status === 401 ? 'Your session expired. Please log in again.' : 'We couldn’t load your applications. Please try again.');
      } finally { if (active) setLoading(false); }
    }
    loadApplications();
    return () => { active = false; };
  }, [navigate]);

  return <>
    <header className="dashboard-header"><div><span className="eyebrow">Your next move</span><h1>My applications</h1><p>Every opportunity you’ve taken a step toward.</p></div><Link className="button" to="/">Explore roles <span aria-hidden="true">→</span></Link></header>
    {loading && <div className="loading-panel"><span className="spinner" />Loading your applications…</div>}
    {!loading && error && <div className="error-panel" role="alert">{error} {error.includes('session') && <Link className="text-link" to="/login">Log in →</Link>}</div>}
    {!loading && !error && applications.length === 0 && <div className="empty-state" style={{ marginBottom: 70 }}><strong>Your story starts with one application.</strong><p style={{ margin: '9px 0 18px' }}>Explore open roles and save the ones that feel like a fit.</p><Link className="button" to="/">Browse opportunities →</Link></div>}
    {!loading && !error && applications.length > 0 && <section className="application-list">
      {applications.map((application) => {
        const job = typeof application.job === 'object' ? application.job : null;
        return <article className="application-card" key={application.id}><div><h3>{job?.title || `Application #${application.id}`}</h3><p>{job?.company || 'Application submitted'}{job?.location ? ` · ${job.location}` : ''}</p></div><div className="application-date">Applied {application.applied_at ? new Date(application.applied_at).toLocaleDateString() : 'recently'}</div></article>;
      })}
    </section>}
  </>;
}

export default UserDashboard;
