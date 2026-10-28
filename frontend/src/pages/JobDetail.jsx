import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let active = true;
    axios.get(`/api/jobs/${id}/`)
      .then((response) => { if (active) setJob(response.data); })
      .catch(() => { if (active) setMessage({ type: 'error', text: 'We couldn’t find that role. It may have been removed.' }); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  async function applyToJob() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setMessage({ type: 'error', text: 'Please log in before applying.' });
      return;
    }
    setApplying(true);
    setMessage(null);
    try {
      await axios.post('/api/apply/', { job_id: job.id }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage({ type: 'success', text: 'Application sent. You can follow its progress from My applications.' });
    } catch (error) {
      const detail = error.response?.data?.detail || 'Your application could not be sent. Please try again.';
      setMessage({ type: 'error', text: detail });
    } finally {
      setApplying(false);
    }
  }

  if (loading) return <div className="loading-panel" style={{ margin: '60px 0' }}><span className="spinner" />Loading role details…</div>;
  if (!job) return <div className="error-panel" style={{ margin: '50px 0' }} role="alert">{message?.text || 'Role not found.'}<p style={{ marginTop: 16 }}><Link className="text-link" to="/">Back to opportunities →</Link></p></div>;

  return <div className="detail-layout">
    <article className="detail-main">
      <Link className="text-link" to="/">← All opportunities</Link>
      <h1 className="detail-title">{job.title}</h1><div className="detail-company">{job.company} · {job.location}</div>
      <div className="job-meta"><span className="tag tag-accent">{job.job_type}</span>{job.salary && <span className="tag">{job.salary}</span>}</div>
      <h2>About the role</h2><p>{job.description || 'The team has not added a role description yet.'}</p>
      {message && <div className={`feedback ${message.type}`} role="status">{message.text}</div>}
    </article>
    <aside className="detail-aside"><h3>A role worth exploring</h3><div className="detail-row"><span>Company</span><strong>{job.company}</strong></div><div className="detail-row"><span>Location</span><strong>{job.location}</strong></div><div className="detail-row"><span>Schedule</span><strong>{job.job_type}</strong></div>{job.salary && <div className="detail-row"><span>Compensation</span><strong>{job.salary}</strong></div>}<button className="button" type="button" onClick={applyToJob} disabled={applying}>{applying ? <><span className="spinner" />Sending…</> : <>Apply for this role <span aria-hidden="true">→</span></>}</button><p>Your application uses the resume on your account. You can upload or update it any time.</p></aside>
  </div>;
}

export default JobDetail;
