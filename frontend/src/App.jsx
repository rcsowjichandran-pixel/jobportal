import { BrowserRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ResumeUpload from './pages/ResumeUpload';
import UserDashboard from './pages/UserDashboard';

function SiteHeader() {
  useLocation();
  const signedIn = Boolean(localStorage.getItem('access_token'));

  return <header className="site-header">
    <Link className="brand" to="/" aria-label="Northstar jobs home">
      <span className="brand-mark">N</span><span>northstar<span className="brand-dot">.</span></span>
    </Link>
    <nav className="main-nav" aria-label="Main navigation">
      <NavLink to="/" end>Find a job</NavLink>
      {signedIn && <NavLink to="/dashboard">My applications</NavLink>}
    </nav>
    <div className="header-actions">
      {signedIn ? <Link className="button button-small button-outline" to="/resume">Upload resume <span aria-hidden="true">↗</span></Link> : <><Link className="login-link" to="/login">Log in</Link><Link className="button button-small" to="/register">Create account <span aria-hidden="true">↗</span></Link></>}
    </div>
  </header>;
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <SiteHeader />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/resume" element={<ResumeUpload />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="*" element={<JobList />} />
          </Routes>
        </main>
        <footer className="site-footer"><span>northstar<span className="brand-dot">.</span></span><span>Thoughtful work starts with the right next step.</span><span>© {new Date().getFullYear()} Northstar</span></footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
