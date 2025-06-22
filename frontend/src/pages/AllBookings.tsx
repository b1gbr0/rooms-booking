import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Booking {
  id: string;
  room: {
    name: string;
    location: string;
  };
  startTime: string;
  endTime: string;
}

export function AllBookings() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api<Booking[]>('/bookings', {}, token);
      setBookings(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to load bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadBookings();
  }, [token]);

  const cancelBooking = async (id: string) => {
    setError(null);
    setSuccess(null);
    try {
      await api(`/bookings/${id}`, { method: 'DELETE' }, token);
      setSuccess('Booking cancelled successfully');
      await loadBookings();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to cancel booking');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">All Bookings</h2>

      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!loading && bookings.length === 0 && <p>No bookings found.</p>}

      <div className="list-group">
        {bookings.map((booking) => (
          <div key={booking.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{booking.room.name}</strong> ({booking.room.location})<br />
              {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}
            </div>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => cancelBooking(booking.id)}
            >
              Cancel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
