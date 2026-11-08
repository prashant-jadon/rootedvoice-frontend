'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  email: string;
  role: 'therapist' | 'client' | 'admin';
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface ImpersonationInfo {
  impersonatedBy: string;
  impersonatedByEmail?: string;
  expiresAt?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  impersonation: ImpersonationInfo | null;
  endImpersonation: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Decode a JWT payload client-side. Trust is only for presentation — the real
// authority is the server validating the signature on every request.
function decodeJwtPayload(token: string): any | null {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [impersonation, setImpersonation] = useState<ImpersonationInfo | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      // 1) Honor an incoming impersonation handoff from the admin panel.
      try {
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const incoming = params.get('impersonationToken');
          if (incoming) {
            const claims = decodeJwtPayload(incoming);
            if (claims?.impersonation) {
              // Preserve the real logged-in session (if any) so the admin can
              // "return" to their own session when they finish view-as.
              const realToken = localStorage.getItem('token');
              const realUser = localStorage.getItem('user');
              if (realToken && realUser) {
                localStorage.setItem('rv_pre_impersonation_token', realToken);
                localStorage.setItem('rv_pre_impersonation_user', realUser);
              }
              localStorage.setItem('token', incoming);
              // Minimal user record from token; /auth/me will fill in the rest shortly.
              const bootstrapUser = {
                id: claims.userId,
                email: '',
                role: claims.role,
                firstName: '',
                lastName: '',
              };
              localStorage.setItem('user', JSON.stringify(bootstrapUser));
              const info: ImpersonationInfo = {
                impersonatedBy: claims.impersonatedBy,
                impersonatedByEmail: claims.impersonatedByEmail,
                expiresAt: claims.exp ? claims.exp * 1000 : undefined,
              };
              localStorage.setItem('rv_impersonation', JSON.stringify(info));
              setImpersonation(info);
              // Scrub the token from the URL.
              params.delete('impersonationToken');
              const next = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
              window.history.replaceState({}, '', next);
            }
          }
        }
      } catch (err) {
        console.error('Failed to apply impersonation handoff:', err);
      }

      // 2) Hydrate any persisted impersonation banner state.
      try {
        const raw = localStorage.getItem('rv_impersonation');
        if (raw) {
          const info = JSON.parse(raw) as ImpersonationInfo;
          if (!info.expiresAt || info.expiresAt > Date.now()) {
            setImpersonation(info);
          } else {
            localStorage.removeItem('rv_impersonation');
          }
        }
      } catch { /* ignore */ }

      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Failed to parse saved user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const endImpersonation = () => {
    const info = impersonation;
    const preToken = localStorage.getItem('rv_pre_impersonation_token');
    const preUser = localStorage.getItem('rv_pre_impersonation_user');
    const impersonatedUserId = (() => {
      try {
        return JSON.parse(localStorage.getItem('user') || '{}').id;
      } catch {
        return null;
      }
    })();

    // Best-effort audit-log ping; failure is non-fatal.
    const token = localStorage.getItem('token');
    if (token && impersonatedUserId) {
      const apiBase =
        (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:5001/api';
      fetch(`${apiBase}/admin/impersonate/${impersonatedUserId}/end`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).catch(() => undefined);
    }

    localStorage.removeItem('rv_impersonation');
    localStorage.removeItem('rv_pre_impersonation_token');
    localStorage.removeItem('rv_pre_impersonation_user');
    if (preToken && preUser) {
      localStorage.setItem('token', preToken);
      localStorage.setItem('user', preUser);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setImpersonation(null);
    setUser(null);
    void info;
    if (typeof window !== 'undefined') {
      window.location.href = preToken ? '/dashboard' : '/login';
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { user: userData, accessToken } = response.data.data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authAPI.register(data);
      const { user: userData, accessToken } = response.data.data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    impersonation,
    endImpersonation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

