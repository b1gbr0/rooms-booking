import { useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Props {
  onClose: () => void;
  onRoomAdded: () => void;
}

export function AddRoomModal({ onClose, onRoomAdded }: Props) {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState<number>(1);
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      await api('/rooms', {
        method: 'POST',
        body: JSON.stringify({ name, capacity, location }),
      }, token);

      setSuccess(true);
      onRoomAdded();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to add room');
      }
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Add New Room</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label className="form-label">Room Name</label>
                <input
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Capacity</label>
                <input
                  className="form-control"
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  min={1}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  className="form-control"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-success">
                Add Room
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>

          {success && <div className="alert alert-success">Room added successfully</div>}
        </div>
      </div>
    </div>
  );
}
