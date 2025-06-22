import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { BookRoomModal } from '../components/BookRoomModal';
import { useAuth } from '../context/AuthContext';
import type { Room, JwtPayload } from '../types'
import { AddRoomModal } from '../components/AddRoomModal';
import { jwtDecode } from 'jwt-decode';

export function Rooms() {
  const { token } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  });

  const loadRooms = () => {
    if (!token) return;

    api<Room[]>('/rooms', {}, token)
      .then(setRooms)
      .catch((err) => setError(err.message || 'Failed to load rooms'));
  };

  const isAdmin = (() => {
    try {
      if (!token) return false;
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.role === 'ADMIN';
    } catch {
      return false;
    }
  })();

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Available Meeting Rooms</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {isAdmin && (
        <div className="mb-3 text-end">
          <button className="btn btn-success" onClick={() => setShowAddModal(true)}>
            Add Room
          </button>
        </div>
      )}

      <div className="row">
        {rooms.map((room) => (
          <div className="col-md-4 mb-3" key={room.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{room.name}</h5>
                <p className="card-text">
                  Capacity: {room.capacity} <br />
                  Location: {room.location}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setSelectedRoomId(room.id)}
                >
                  Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedRoomId && (
        <BookRoomModal
          roomId={selectedRoomId}
          onClose={() => setSelectedRoomId(null)}
        />
      )}

      {showAddModal && (
        <AddRoomModal
          onClose={() => setShowAddModal(false)}
          onRoomAdded={() => {
            loadRooms();
          }}
        />
      )}
    </div>
  );
}
