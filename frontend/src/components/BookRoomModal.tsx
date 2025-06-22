import { useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { FormEvent } from 'react';

interface Props {
  roomId: string;
  onClose: () => void;
}

export function BookRoomModal({ roomId, onClose }: Props) {
  const { token } = useAuth();
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      await api(
        '/bookings',
        {
          method: 'POST',
          body: JSON.stringify({
            roomId,
            startTime,
            endTime,
          }),
        },
        token
      );
      setSuccess(true);
      setStartTime('');
      setEndTime('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Booking failed');
      }
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Book Room</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">Booking created!</div>}

              <div className="mb-3">
                <label className="form-label">Start Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">End Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              {!success && (
                <button type="submit" className="btn btn-primary">
                  Book
                </button>
              )}
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                {success ? 'Close' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
