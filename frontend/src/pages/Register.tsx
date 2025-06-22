import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import type { FormEvent } from 'react';

export function Register() {
  const { setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await api<{ access_token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, username, password }),
      });
      setToken(data.access_token);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <div className="fullscreen-centered">
      <div className="auth-card">
      <h2 className="text-center mb-4">Register</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required
          />
        </div>

        <button className="btn btn-success w-100" type="submit">
          Register
        </button>
      </form>

      <div className="text-center mt-3">
        Already registered? <a href="/login">Login</a>
      </div>
    </div>
    </div>
  );
}
