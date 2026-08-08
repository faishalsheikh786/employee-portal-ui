import {
  confirmResetPassword,
  confirmSignUp,
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  resendSignUpCode,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from 'aws-amplify/auth'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { directoryApi } from '../api/directoryApi'
import type { PortalUser, Role } from '../types'

interface SignUpInput {
  firstName: string
  lastName: string
  email: string
  password: string
  requestedRole: Role
}

interface AuthContextValue {
  user: PortalUser | null
  loading: boolean
  signInWithPassword: (email: string, password: string) => Promise<void>
  register: (input: SignUpInput) => Promise<'CONFIRM_SIGN_UP' | 'DONE'>
  confirmRegistration: (email: string, code: string) => Promise<void>
  resendConfirmation: (email: string) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  completePasswordReset: (email: string, code: string, newPassword: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function normalizeRole(value?: string): Role {
  const role = value?.toUpperCase()
  if (role === 'ADMIN' || role === 'MANAGER') return role
  return 'EMPLOYEE'
}

function roleFromGroups(groups: string[]): Role {
  if (groups.includes('ADMIN')) return 'ADMIN'
  if (groups.includes('MANAGER')) return 'MANAGER'
  return 'EMPLOYEE'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PortalUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const [current, attributes, session] = await Promise.all([
        getCurrentUser(),
        fetchUserAttributes(),
        fetchAuthSession(),
      ])

      const rawGroups = session.tokens?.accessToken?.payload['cognito:groups']
      const groups = Array.isArray(rawGroups) ? rawGroups.map(String) : []
      const requestedRole = normalizeRole(attributes['custom:requested_role'])
      const role = roleFromGroups(groups)
      const email = attributes.email || current.signInDetails?.loginId || current.username
      const name = [attributes.given_name, attributes.family_name].filter(Boolean).join(' ') || email.split('@')[0]

      let employeeId: number | undefined
      let managerId: number | undefined
      let title = role === 'ADMIN' ? 'Portal Administrator' : role === 'MANAGER' ? 'People Manager' : 'Employee'

      try {
        const employees = await directoryApi.employees()
        const employee = employees.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase())
        if (employee) {
          employeeId = employee.id
          managerId = employee.manager_id ?? undefined
          title = employee.job_title
        }
      } catch {
        // Authentication should still work when a backend is temporarily unavailable.
      }

      setUser({
        id: current.userId,
        employeeId,
        managerId,
        name,
        email,
        role,
        requestedRole,
        roleApproved: requestedRole === 'EMPLOYEE' || role === requestedRole || role === 'ADMIN',
        groups,
        title,
      })
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void refreshUser() }, [refreshUser])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    signInWithPassword: async (email, password) => {
      const result = await signIn({ username: email.trim().toLowerCase(), password })
      if (!result.isSignedIn) throw new Error(`Additional sign-in step required: ${result.nextStep.signInStep}`)
      await refreshUser()
    },
    register: async ({ firstName, lastName, email, password, requestedRole }) => {
      const result = await signUp({
        username: email.trim().toLowerCase(),
        password,
        options: {
          userAttributes: {
            email: email.trim().toLowerCase(),
            given_name: firstName.trim(),
            family_name: lastName.trim(),
            'custom:requested_role': requestedRole,
          },
        },
      })
      return result.nextStep.signUpStep === 'CONFIRM_SIGN_UP' ? 'CONFIRM_SIGN_UP' : 'DONE'
    },
    confirmRegistration: async (email, code) => {
      await confirmSignUp({ username: email.trim().toLowerCase(), confirmationCode: code.trim() })
    },
    resendConfirmation: async (email) => {
      await resendSignUpCode({ username: email.trim().toLowerCase() })
    },
    requestPasswordReset: async (email) => {
      await resetPassword({ username: email.trim().toLowerCase() })
    },
    completePasswordReset: async (email, code, newPassword) => {
      await confirmResetPassword({ username: email.trim().toLowerCase(), confirmationCode: code.trim(), newPassword })
    },
    logout: async () => {
      await signOut()
      setUser(null)
    },
    refreshUser,
  }), [loading, refreshUser, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
