import React, { createContext, useContext, useEffect, useState } from 'react'

export type AuthUser = { id: number; nome: string; email: string }

type AuthContextType = {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('ts_user')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  async function login(email: string, password: string) {
    const payload = { email: email.trim().toLowerCase(), password: password.trim() };

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/User/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.mensagem || 'Falha no login');

    setUser(body);
    localStorage.setItem('ts_user', JSON.stringify(body));
  }


  function logout() {
    setUser(null)
    localStorage.removeItem('ts_user')
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
