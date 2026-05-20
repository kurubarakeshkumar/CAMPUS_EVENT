import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MyRegistrations({ user }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`/api/registrations/user/${user.id}`);
      if (response.ok) {
        setRegistrations(await response.json());
      }
    } catch (error) {
      console.error("Failed to fetch registrations", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="hero">
        <h1 style={{fontSize: '3rem', marginBottom: '1rem'}}>My Event Journey</h1>
        <p style={{fontSize: '1.25rem', opacity: 0.9}}>Track your registrations, prepare for upcoming events, and provide feedback.</p>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h2 style={{fontSize: '1.5rem', fontWeight: 700}}>Registered Events</h2>
        <span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{registrations.length} events joined</span>
      </div>

      <div className="events-grid">
        {registrations.map(reg => {
          const event = reg.event;
          if (!event) return null; // Safety guard: Skip if event data is missing

          return (
            <div key={reg.id} className="card event-card">
              <span className="event-badge">{event.type}</span>
              <div style={{paddingTop: '1rem', marginBottom: '1rem'}}>
                <h3 style={{fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary-color)'}}>{event.title}</h3>
                <p style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>📍 {event.venue}</p>
              </div>

              <div style={{marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem'}}>
                <div style={{fontSize: '0.825rem', marginBottom: '1rem'}}>
                  <p style={{marginBottom: '0.25rem'}}>📅 {new Date(event.eventDate).toLocaleDateString()} at {event.eventTime}</p>
                  <p style={{color: 'var(--success)', fontWeight: 600}}>
                    ✓ Confirmed on {new Date(reg.registrationDate).toLocaleDateString()}
                  </p>
                </div>

                <Link to={`/event/${event.id}`} className="btn btn-primary" style={{width: '100%'}}>
                  Event Details & Feedback
                </Link>
              </div>
            </div>
          );
        })}
        {registrations.length === 0 && (
          <div className="card" style={{textAlign: 'center', gridColumn: '1 / -1', padding: '3rem'}}>
            <p style={{fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1.5rem'}}>You haven't registered for any events yet.</p>
            <Link to="/events" className="btn btn-primary">Browse Upcoming Events</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;
