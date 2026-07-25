import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('adminToken', data.token);
      toast.success('Logged in successfully');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4 text-neutral-900 transition-colors dark:bg-black dark:text-neutral-100">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-600/70 to-transparent" />

      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 shadow-[0_30px_80px_-35px_rgba(0,0,0,0.25)] dark:border-white/10 dark:bg-neutral-950 dark:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-semibold tracking-tight">Admin Login</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Sign in to manage your leads</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="username" className="mb-1.5 block font-mono text-[0.68rem] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Username</label>
            <input
              type="text"
              id="username"
              className="w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm text-neutral-900 transition-colors focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-100"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block font-mono text-[0.68rem] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Password</label>
            <input
              type="password"
              id="password"
              className="w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm text-neutral-900 transition-colors focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="mt-2 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
