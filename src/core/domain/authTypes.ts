// =============================================================================
// VELORA'S FLASH FORGE - AUTHENTICATION & AUTHORIZATION TYPES
// =============================================================================

export type UserRole = 'customer' | 'admin' | 'merchant';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  failedLoginAttempts?: number;
  lockedUntil?: string | null;
}

export interface SignUpRequest {
  fullName: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
  error?: string;
  lockoutRemainingSeconds?: number;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
