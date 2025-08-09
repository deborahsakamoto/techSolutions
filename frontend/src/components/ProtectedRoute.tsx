import { Navigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import type { ReactNode } from 'react'

type ProtectedRouteProps = { children: ReactNode }

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}