import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';

function DashboardLayout({ user, onLogout }) {
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({ name: user?.name || '', department: user?.department || '', password: '' });
  const [loading, setLoading] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        // Update local storage and force reload or ideally update App state
        // For simplicity since we don't have updateUser passed down, we'll just reload
        localStorage.setItem('user', JSON.stringify({...updatedUser, role: user.role, email: user.email}));
        window.location.reload();
      } else {
        alert('Failed to update profile');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div style={{marginBottom: '2rem'}}>
          <h1 className="gradient-text" style={{fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em'}}>CAMPUS PORTAL</h1>
          <div style={{marginTop: '2rem', padding: '1.25rem', background: 'var(--bg-color)', borderRadius: '0.5rem', border: '1px solid var(--border-color)'}}>
            <div style={{color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem'}}>{user.name}</div>
            <div style={{color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 500}}>{user.role} • {user.department || 'Campus'}</div>
          </div>
        </div>
        
        <nav className="sidebar-nav" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <Link to={user.role === 'ADMIN' ? "/admin/dashboard" : "/events"} 
                className={`nav-item ${location.pathname === '/events' || location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
            🏠 Dashboard Home
          </Link>
          
          {user.role === 'STUDENT' ? (
            <Link to="/my-registrations" 
                  className={`nav-item ${location.pathname === '/my-registrations' ? 'active' : ''}`}>
              ✅ My Registrations
            </Link>
          ) : (
             <Link to="/events" className="nav-item">
               📅 Manage Events
             </Link>
          )}

          <div style={{marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <button onClick={() => setShowProfileModal(true)} className="nav-item" style={{width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--text-main)'}}>
              ⚙️ Edit Profile
            </button>
            <button onClick={onLogout} className="nav-item" style={{width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--danger)'}}>
              🚪 Sign Out
            </button>
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header" style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 2.5rem'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <span style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>Welcome back, <strong>{user.name}</strong></span>
            <div style={{width: '38px', height: '38px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, boxShadow: 'var(--shadow-md)'}}>
              {user.name?.[0]}
            </div>
          </div>
        </header>

        <div className="content" style={{padding: '2.5rem'}}>
          <Outlet />
        </div>
      </main>

      {showProfileModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100}}>
          <div className="card" style={{width: '100%', maxWidth: '400px', padding: '2rem'}}>
            <h3 style={{marginBottom: '1.5rem'}}>Edit Profile</h3>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" required value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input type="text" required value={profileData.department} onChange={e => setProfileData({...profileData, department: e.target.value})} />
              </div>
              <div className="form-group">
                <label>New Password (Optional)</label>
                <input type="password" placeholder="Leave blank to keep current" value={profileData.password} onChange={e => setProfileData({...profileData, password: e.target.value})} />
              </div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
                <button type="button" className="btn" disabled={loading} onClick={() => setShowProfileModal(false)} style={{flex: 1, backgroundColor: 'var(--border-color)'}}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{flex: 1}}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;
