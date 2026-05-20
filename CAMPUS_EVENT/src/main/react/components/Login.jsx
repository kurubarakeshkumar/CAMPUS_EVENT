import { useState } from 'react';
import { Link } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Unexpected server response');
      }

      if (response.ok) {
        onLogin(data);
      } else {
        setError(data.error || 'Invalid email or password.');
      }
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="gradient-text">Welcome</h2>
        <p>Access your campus events and manage registrations.</p>
        
        {error && <div style={{color: 'var(--danger)', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem'}}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{width: '100%', marginTop: '1rem', opacity: loading ? 0.7 : 1}}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div style={{marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)'}}>
          New to the portal? <Link to="/register" style={{color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none'}}>Create an Account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
