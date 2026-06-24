// ─────────────────────────────────────────
// User Types
// ─────────────────────────────────────────

export interface User {
  $id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  role: 'user' | 'admin';
}

// ─────────────────────────────────────────
// Auth Types
// ─────────────────────────────────────────

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone?: string;
}
