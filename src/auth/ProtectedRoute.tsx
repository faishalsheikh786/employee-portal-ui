import { Box, CircularProgress } from '@mui/material'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import type { Role } from '../types'
import { useAuth } from './AuthContext'

export function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: Role[] }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <Box minHeight="100vh" display="grid" sx={{ placeItems: 'center' }}><CircularProgress /></Box>
  }
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}
