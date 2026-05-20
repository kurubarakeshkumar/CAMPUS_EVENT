import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import EventList from './components/EventList.jsx';
import EventDetails from './components/EventDetails.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import MyRegistrations from './components/MyRegistrations.jsx';
import Chatbot from './components/Chatbot.jsx';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/events'} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes inside Layout */}
        <Route element={<DashboardLayout user={user} onLogout={handleLogout} />}>
          {/* Student Routes */}
          <Route path="/events" element={user ? <EventList /> : <Navigate to="/login" />} />
          <Route path="/event/:id" element={user ? <EventDetails user={user} /> : <Navigate to="/login" />} />
          <Route path="/my-registrations" element={user ? <MyRegistrations user={user} /> : <Navigate to="/login" />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={user && user.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/events" />} />
        </Route>
      </Routes>
      <Chatbot />
    </>
  );
}

export default App;
