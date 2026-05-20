import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function EventDetails({ user }) {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState('');

  // Feedback form state
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');

  useEffect(() => {
    fetchEvent();
    checkRegistration();
    fetchFeedback();
  }, [id]);

  const fetchEvent = async () => {
    const res = await fetch(`/api/events/${id}`);
    if (res.ok) setEvent(await res.json());
  };

  const checkRegistration = async () => {
    const res = await fetch(`/api/registrations/user/${user.id}`);
    if (res.ok) {
      const regs = await res.json();
      setIsRegistered(regs.some(r => r.event.id === parseInt(id)));
    }
  };

  const fetchFeedback = async () => {
    const res = await fetch(`/api/feedback?eventId=${id}`);
    if (res.ok) setFeedbackList(await res.json());
  };

  const handleRegister = async () => {
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, eventId: id })
    });
    if (res.ok) {
      setIsRegistered(true);
      setMessage("Successfully registered!");
    } else {
      const data = await res.json();
      setMessage(data.error || "Registration failed");
    }
  };

  const handleUnregister = async () => {
    const res = await fetch(`/api/registrations/user/${user.id}/event/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      setIsRegistered(false);
      setMessage("Successfully unregistered from event!");
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || "Failed to unregister");
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: { id: parseInt(id) }, user: { id: user.id }, rating, comments })
    });
    if (res.ok) {
      setComments('');
      fetchFeedback();
      setMessage("Feedback submitted!");
    }
  };

  if (!event) return <div style={{padding: '4rem', textAlign: 'center'}}>Loading event details...</div>;

  return (
    <div style={{maxWidth: '1000px', margin: '0 auto'}}>
      <div className="hero" style={{textAlign: 'left', padding: '3rem'}}>
        <span className="event-badge" style={{position: 'static', background: 'rgba(255,255,255,0.2)', color: 'white', marginBottom: '1rem', display: 'inline-block'}}>
          {event?.type}
        </span>
        <h2 style={{fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem'}}>{event?.title}</h2>
        <div style={{display: 'flex', gap: '2rem', fontSize: '1rem', opacity: 0.9}}>
           <span>📅 {event?.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'Date TBD'}</span>
           <span>⏰ {event?.eventTime}</span>
           <span>📍 {event?.venue}</span>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', marginTop: '2rem'}}>
        <div className="card">
          <h3 style={{marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 700}}>About the Event</h3>
          <p style={{lineHeight: '1.8', color: 'var(--text-main)', fontSize: '1.05rem'}}>{event?.description}</p>
          
          <div style={{marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem'}}>
             <div>
                <span style={{display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700}}>Department</span>
                <span style={{fontWeight: 600}}>{event?.department}</span>
             </div>
             <div>
                <span style={{display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700}}>Capacity</span>
                <span style={{fontWeight: 600}}>{event?.capacity || 'Open Registration'}</span>
             </div>
          </div>
        </div>

        <div className="card" style={{height: 'fit-content', position: 'sticky', top: '100px'}}>
           <h3 style={{marginBottom: '1.5rem', fontSize: '1.1rem'}}>Registration</h3>
           {user?.role === 'STUDENT' ? (
             <>
               {isRegistered ? (
                 <button 
                   className="btn" 
                   onClick={handleUnregister}
                   style={{width: '100%', padding: '1rem', background: 'var(--danger)', color: 'white'}}>
                   Unregister
                 </button>
               ) : (
                 <button 
                   className="btn btn-primary" 
                   onClick={handleRegister}
                   style={{width: '100%', padding: '1rem'}}>
                   Register Now
                 </button>
               )}
               {message && <div style={{marginTop: '1rem', fontSize: '0.875rem', textAlign: 'center', color: 'var(--primary-color)', fontWeight: 600}}>{message}</div>}
             </>
           ) : (
             <div style={{color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem'}}>
                Only students can register for events.
             </div>
           )}
        </div>
      </div>

      {user?.role === 'STUDENT' && isRegistered && (
        <div className="card" style={{marginTop: '2rem'}}>
          <h3 style={{marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700}}>Post Event Feedback</h3>
          <form onSubmit={submitFeedback}>
            <div className="form-group">
              <label>Rating (1-5)</label>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={()=>setRating(s)} style={{padding: '0.5rem 1rem', borderRadius: '0.5rem', background: rating >= s ? 'var(--primary-color)' : '#f1f5f9', color: rating >= s ? 'white' : 'inherit', border: 'none', cursor: 'pointer'}}>
                    {s} ⭐
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Your Comments</label>
              <textarea rows="4" value={comments} onChange={e=>setComments(e.target.value)} placeholder="What did you think of the event?" required></textarea>
            </div>
            <button className="btn btn-primary" type="submit">Submit Professional Feedback</button>
          </form>
        </div>
      )}

      {feedbackList.length > 0 && (
        <div style={{marginTop: '3rem'}}>
          <h3 style={{marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700}}>Participant Reviews</h3>
          <div style={{display: 'grid', gap: '1rem'}}>
            {feedbackList.map(fb => (
              <div key={fb.id} className="card" style={{padding: '1.25rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem'}}>
                  <div>
                    <strong style={{fontSize: '1rem'}}>{fb.user?.name}</strong>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{fb.user?.department}</div>
                  </div>
                  <span style={{color: '#f59e0b'}}>{ "⭐".repeat(fb.rating) }</span>
                </div>
                <p style={{color: 'var(--text-main)', fontStyle: 'italic'}}>"{fb.comments}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetails;
