import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading events...</div>;

  return (
    <div>
      <div className="hero">
        <h1 style={{fontSize: '3rem', marginBottom: '1rem'}}>Academic Campus Portal</h1>
        <p style={{fontSize: '1.25rem', opacity: 0.9, marginBottom: '2rem'}}>Discover and register for the most exciting events happening across campus.</p>
        
        <div style={{maxWidth: '600px', margin: '0 auto', position: 'relative'}}>
          <input 
            type="text" 
            placeholder="Search events, departments, or types..." 
            className="card"
            style={{width: '100%', padding: '1rem 1.5rem', borderRadius: '2rem', border: 'none', fontSize: '1.05rem', boxShadow: 'var(--shadow-lg)'}}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h2 style={{fontSize: '1.5rem', fontWeight: 700}}>Featured Events</h2>
        <span style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>{filteredEvents.length} events found</span>
      </div>

      <div className="events-grid">
        {filteredEvents.map(event => (
          <div key={event.id} className="card event-card">
            <span className="event-badge">{event.type}</span>
            <div style={{paddingTop: '1rem', marginBottom: '1rem'}}>
              <h3 style={{fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary-color)'}}>{event.title}</h3>
              <p style={{fontSize: '0.875rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                {event.description}
              </p>
            </div>
            
            <div style={{marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.825rem', marginBottom: '1rem'}}>
                <span>📅 {new Date(event.eventDate).toLocaleDateString()}</span>
                <span style={{textAlign: 'right'}}>⏰ {event.eventTime}</span>
                <span>📍 {event.venue}</span>
                <span style={{textAlign: 'right', fontWeight: 600}}>🏢 {event.department}</span>
              </div>
              
              <Link to={`/event/${event.id}`} className="btn btn-primary" style={{width: '100%'}}>
                View Details
              </Link>
            </div>
          </div>
        ))}
        {filteredEvents.length === 0 && <p>No events available right now.</p>}
      </div>
    </div>
  );
}

export default EventList;
