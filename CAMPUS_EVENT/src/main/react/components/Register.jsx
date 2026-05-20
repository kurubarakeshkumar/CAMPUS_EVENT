import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
    department: 'CS'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="gradient-text">Create Account</h2>
        <p>Join the community and start discovering events.</p>
        
        {error && <div style={{color: 'var(--danger)', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem'}}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="STUDENT">Student</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label>Department</label>
            <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem'}} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <div style={{marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)'}}>
          Already have an account? <Link to="/login" style={{color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none'}}>Login here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
