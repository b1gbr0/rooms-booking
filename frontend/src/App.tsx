// App.tsx
import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Rooms } from './pages/Rooms';
import { MyBookings } from './pages/MyBookings';
import { AllBookings } from './pages/AllBookings';
import './App.css';
import { api } from './lib/api';

type Profile = {
  userId: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

function AppRoutes() {
  const { token, setToken } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setProfile(null);
      return;
    }

    api<Profile>('/auth/profile', {}, token)
      .then(setProfile)
      .catch(() => {
        setToken(null);
        navigate('/login');
      });
  }, [token, setToken, navigate]);

  const logout = () => {
    setToken(null);
    navigate('/login');
  };

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <NavLink className="navbar-brand" to="/rooms">
            MeetingRooms
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav me-auto">
              <NavLink
                to="/rooms"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
              >
                Rooms
              </NavLink>
              <NavLink
                to="/my-bookings"
                className={({ isActive }) =>
                  'nav-link' + (isActive ? ' active' : '')
                }
              >
                My Bookings
              </NavLink>
              {profile?.role === 'ADMIN' && (
                <NavLink
                  to="/bookings"
                  className={({ isActive }) =>
                    'nav-link' + (isActive ? ' active' : '')
                  }
                >
                  All Bookings
                </NavLink>
              )}
            </div>
            <button
              className="btn btn-outline-danger"
              onClick={logout}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        {profile?.role === 'ADMIN' && (
          <Route path="/bookings" element={<AllBookings />} />
        )}
        <Route path="*" element={<Navigate to="/rooms" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
