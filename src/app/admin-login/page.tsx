'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter your credentials.');
      return;
    }

    setIsLoading(true);
    // Simulate async call — replace with Firebase/Appwrite auth later
    await new Promise((r) => setTimeout(r, 900));
    setIsLoading(false);

    // UI-only: any non-empty credentials succeed for now
    router.push('/admin');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#15110D' }}
    >
      {/* Ambient background blobs */}
      <div
        className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #B8956A 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-8 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #B8956A 0%, transparent 70%)',
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(184,149,106,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(184,149,106,0.5) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative w-full max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 mb-4">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <circle cx="50" cy="50" r="48" fill="#1a1410" stroke="#B8956A" strokeWidth="2" />
              <text x="50" y="44" textAnchor="middle" fill="#EDE3D0" fontSize="18" fontFamily="Georgia, serif" fontWeight="700" letterSpacing="2">THE</text>
              <text x="50" y="62" textAnchor="middle" fill="#B8956A" fontSize="24" fontFamily="Georgia, serif" fontWeight="900" letterSpacing="-1">XVIII</text>
              <text x="50" y="74" textAnchor="middle" fill="#EDE3D0" fontSize="8" fontFamily="Georgia, serif" letterSpacing="3">BREW CO.</text>
            </svg>
          </div>
          <p
            className="text-[10px] tracking-[0.35em] uppercase mt-1"
            style={{ color: '#B8956A', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border p-8"
          style={{
            background: 'rgba(30, 24, 18, 0.8)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(184, 149, 106, 0.2)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
          }}
        >
          <h1
            className="text-2xl font-semibold mb-1"
            style={{ color: '#EDE3D0', fontFamily: 'Georgia, serif', letterSpacing: '0.02em' }}
          >
            Welcome back
          </h1>
          <p
            className="text-sm mb-8"
            style={{ color: 'rgba(237,227,208,0.45)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            Sign in to the XVIII Brew admin panel.
          </p>

          {error && (
            <div
              className="mb-6 px-4 py-3 rounded-lg text-sm border"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="admin-username"
                className="block text-xs mb-2 tracking-[0.15em] uppercase"
                style={{ color: 'rgba(237,227,208,0.6)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(184,149,106,0.6)' }}>
                  <User size={16} />
                </div>
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="admin"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(184,149,106,0.2)',
                    color: '#EDE3D0',
                    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(184,149,106,0.6)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(184,149,106,0.2)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs mb-2 tracking-[0.15em] uppercase"
                style={{ color: 'rgba(237,227,208,0.6)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(184,149,106,0.6)' }}>
                  <Lock size={16} />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(184,149,106,0.2)',
                    color: '#EDE3D0',
                    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(184,149,106,0.6)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(184,149,106,0.2)'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: 'rgba(184,149,106,0.5)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#B8956A'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(184,149,106,0.5)'; }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-300 relative overflow-hidden"
              style={{
                background: isLoading ? 'rgba(184,149,106,0.5)' : '#B8956A',
                color: '#15110D',
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => { if (!isLoading) (e.currentTarget as HTMLElement).style.background = '#EDE3D0'; }}
              onMouseLeave={(e) => { if (!isLoading) (e.currentTarget as HTMLElement).style.background = '#B8956A'; }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing In…
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p
            className="mt-6 text-center text-xs"
            style={{ color: 'rgba(237,227,208,0.25)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            Restricted access — authorised personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}
