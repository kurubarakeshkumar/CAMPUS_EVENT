import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, User, Bot } from 'lucide-react';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your Campus Assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }]);
    }, 1000);
  };

  const getBotResponse = (text) => {
    const t = text.toLowerCase();
    if (t.includes('hello') || t.includes('hi')) return "Hello there! Looking for some events?";
    if (t.includes('event')) return "We have many events! You can find Technical, Cultural, and Sports events on the dashboard.";
    if (t.includes('register')) return "To register for an event, just click on the event card and hit the 'Register' button.";
    if (t.includes('admin')) return "Admins can create and manage events. Students can browse and register.";
    if (t.includes('otp') || t.includes('mail')) return "OTP is required for all new registrations to verify your email address.";
    return "That's a great question! You can find more info in the 'Manage Events' section or contact the support desk.";
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-color)',
            color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <MessageSquare size={30} />
        </button>
      ) : (
        <div style={{
          width: '350px', height: '450px', backgroundColor: 'var(--card-bg)', borderRadius: '1rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column',
          border: '1px solid var(--border-color)', overflow: 'hidden'
        }}>
          <div style={{
            padding: '1rem', background: 'var(--glass-gradient)', display: 'flex', 
            justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={20} />
              <span style={{ fontWeight: 600 }}>Campus Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
          
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%', padding: '0.75rem', borderRadius: '0.75rem',
                backgroundColor: msg.sender === 'user' ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                fontSize: '0.875rem', border: msg.sender === 'bot' ? '1px solid var(--border-color)' : 'none'
              }}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me something..."
              style={{
                flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)',
                backgroundColor: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none'
              }}
            />
            <button 
              onClick={handleSend}
              style={{ 
                backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', 
                borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer' 
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
