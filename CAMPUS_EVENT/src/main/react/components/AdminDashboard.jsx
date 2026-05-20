import { useState, useEffect } from 'react';

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, totalRegistrations: 0, totalUsers: 0 });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', department: '', type: '', venue: '', eventDate: '', eventTime: '', capacity: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [participantModal, setParticipantModal] = useState({ show: false, event: null, members: [] });

  useEffect(() => {
    fetchEvents();
    fetchStats();
    fetchRegistrations();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    if (res.ok) setEvents(await res.json());
  };

  const fetchRegistrations = async () => {
    const res = await fetch('/api/registrations');
    if (res.ok) setRegistrations(await res.json());
  };

  const fetchStats = async () => {
    const res = await fetch('/api/registrations/stats');
    if (res.ok) setStats(await res.json());
  };

  const fetchEventParticipants = async (event) => {
    const res = await fetch(`/api/registrations/event/${event.id}`);
    if (res.ok) {
      setParticipantModal({ show: true, event, members: await res.json() });
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchEvents();
        fetchStats();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.eventDate) throw new Error("Event date is required");

      const submissionData = {
        ...formData,
        eventDate: new Date(formData.eventDate).toISOString(),
        capacity: formData.capacity ? parseInt(formData.capacity) : null
      };

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      const data = await res.json();

      if (res.ok) {
        setShowModal(false);
        setFormData({ title: '', description: '', department: '', type: '', venue: '', eventDate: '', eventTime: '', capacity: '' });
        fetchEvents();
        fetchStats();
      } else {
        setError(data.error || data.title || 'Failed to create event. Please check your inputs.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h2 style={{fontSize: '1.875rem', fontWeight: 700}}>Admin Dashboard</h2>
        <button className="btn btn-primary" onClick={() => { setError(''); setShowModal(true); }}>+ Create New Event</button>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem'}}>
        <div className="card" style={{textAlign: 'center', padding: '2rem'}}>
          <h3 style={{color: 'var(--primary-color)', fontSize: '2.5rem', fontWeight: 700}}>{stats.totalEvents}</h3>
          <p style={{color: 'var(--text-muted)', fontWeight: 500}}>Active Events</p>
        </div>
        <div className="card" style={{textAlign: 'center', padding: '2rem'}}>
          <h3 style={{color: 'var(--success)', fontSize: '2.5rem', fontWeight: 700}}>{stats.totalRegistrations}</h3>
          <p style={{color: 'var(--text-muted)', fontWeight: 500}}>Participants Registered</p>
        </div>
        <div className="card" style={{textAlign: 'center', padding: '2rem'}}>
          <h3 style={{color: 'var(--text-main)', fontSize: '2.5rem', fontWeight: 700}}>{stats.totalUsers}</h3>
          <p style={{color: 'var(--text-muted)', fontWeight: 500}}>Total Members</p>
        </div>
      </div>

      <div className="card" style={{marginBottom: '3rem'}}>
        <h3 style={{marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700}}>Manage Events</h3>
        <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
          <thead>
            <tr style={{borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)'}}>
              <th style={{padding: '1rem'}}>Event Detail</th>
              <th style={{padding: '1rem'}}>Schedule</th>
              <th style={{padding: '1rem'}}>Venue</th>
              <th style={{padding: '1rem'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                <td style={{padding: '1rem'}}>
                  <div style={{fontWeight: 600}}>{event.title}</div>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{event.department}</div>
                </td>
                <td style={{padding: '1rem'}}>
                  <div>{new Date(event.eventDate).toLocaleDateString()}</div>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{event.eventTime}</div>
                </td>
                <td style={{padding: '1rem'}}>{event.venue}</td>
                <td style={{padding: '1rem', display: 'flex', gap: '0.5rem'}}>
                  <button className="btn" style={{padding: '0.5rem', color: 'var(--primary-color)', background: 'rgba(79, 70, 229, 0.1)'}} onClick={() => fetchEventParticipants(event)}>
                    View
                  </button>
                  <button className="btn" style={{padding: '0.5rem', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)'}} onClick={() => handleDelete(event.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 style={{marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700}}>Recent Participants</h3>
        <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
          <thead>
            <tr style={{borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)'}}>
              <th style={{padding: '1rem'}}>Student</th>
              <th style={{padding: '1rem'}}>Event</th>
              <th style={{padding: '1rem'}}>Department</th>
              <th style={{padding: '1rem'}}>Reg. Date</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(reg => (
              <tr key={reg.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                <td style={{padding: '1rem'}}>
                  <div style={{fontWeight: 600}}>{reg.user?.name}</div>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{reg.user?.email}</div>
                </td>
                <td style={{padding: '1rem'}}>{reg.event?.title}</td>
                <td style={{padding: '1rem'}}>{reg.user?.department}</td>
                <td style={{padding: '1rem'}}>{new Date(reg.registrationDate).toLocaleDateString()}</td>
              </tr>
            ))}
            {registrations.length === 0 && (
              <tr><td colSpan="4" style={{padding: '2rem', textAlign: 'center', color: 'var(--text-muted)'}}>No participants found yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100}}>
          <div className="card" style={{width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'}}>
            <h3 style={{marginBottom: '1rem'}}>Create New Event</h3>
            
            {error && <div style={{backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem', fontSize: '0.875rem'}}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Title</label><input type="text" required value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} /></div>
              <div className="form-group"><label>Description</label><textarea required value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} /></div>
              <div className="form-group"><label>Department</label><input type="text" required value={formData.department} onChange={e=>setFormData({...formData, department: e.target.value})} /></div>
              <div className="form-group"><label>Type</label><input type="text" required value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} /></div>
              <div className="form-group"><label>Venue</label><input type="text" required value={formData.venue} onChange={e=>setFormData({...formData, venue: e.target.value})} /></div>
              <div className="form-group"><label>Date</label><input type="date" required value={formData.eventDate} onChange={e=>setFormData({...formData, eventDate: e.target.value})} /></div>
              <div className="form-group"><label>Time</label><input type="text" required placeholder="e.g. 10:00 AM" value={formData.eventTime} onChange={e=>setFormData({...formData, eventTime: e.target.value})} /></div>
              <div className="form-group"><label>Capacity (Optional)</label><input type="number" value={formData.capacity} onChange={e=>setFormData({...formData, capacity: e.target.value})} /></div>
              <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
                <button type="button" className="btn" disabled={loading} onClick={() => setShowModal(false)} style={{flex: 1, backgroundColor: 'var(--border-color)'}}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{flex: 1}}>
                  {loading ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {participantModal.show && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100}}>
          <div className="card" style={{width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <h3>Participants: {participantModal.event?.title}</h3>
              <button className="btn" onClick={() => setParticipantModal({ show: false, event: null, members: [] })}>Close</button>
            </div>
            
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
              <thead>
                <tr style={{borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)'}}>
                  <th style={{padding: '1rem'}}>Name</th>
                  <th style={{padding: '1rem'}}>Email</th>
                  <th style={{padding: '1rem'}}>Department</th>
                </tr>
              </thead>
              <tbody>
                {participantModal.members.map(reg => (
                  <tr key={reg.id} style={{borderBottom: '1px solid var(--border-color)'}}>
                    <td style={{padding: '1rem', fontWeight: 600}}>{reg.user?.name}</td>
                    <td style={{padding: '1rem'}}>{reg.user?.email}</td>
                    <td style={{padding: '1rem'}}>{reg.user?.department}</td>
                  </tr>
                ))}
                {participantModal.members.length === 0 && (
                  <tr><td colSpan="3" style={{padding: '2rem', textAlign: 'center', color: 'var(--text-muted)'}}>No participants registered yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
