import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings'
import ArrowBack from '@mui/icons-material/ArrowBack'
import Badge from '@mui/icons-material/Badge'
import BusinessCenter from '@mui/icons-material/BusinessCenter'
import CheckCircle from '@mui/icons-material/CheckCircle'
import LockOutlined from '@mui/icons-material/LockOutlined'
import MailOutlined from '@mui/icons-material/MailOutlined'
import ShieldOutlined from '@mui/icons-material/ShieldOutlined'
import SupervisorAccount from '@mui/icons-material/SupervisorAccount'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState, type ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import type { Role } from '../types'

type Mode = 'SIGN_IN' | 'SIGN_UP' | 'CONFIRM' | 'FORGOT' | 'RESET'

const roles: Array<{ role: Role; title: string; description: string; icon: ReactNode; approval?: string }> = [
  { role: 'EMPLOYEE', title: 'Employee', description: 'Personal profile, directory, leave requests and updates.', icon: <Badge /> },
  { role: 'MANAGER', title: 'Manager', description: 'Team visibility, approvals and employee workflows.', icon: <SupervisorAccount />, approval: 'Approval required' },
  { role: 'ADMIN', title: 'Administrator', description: 'Employee administration and operational controls.', icon: <AdminPanelSettings />, approval: 'Admin approval required' },
]

function destination(role: Role) {
  if (role === 'MANAGER') return '/manager/dashboard'
  if (role === 'ADMIN') return '/admin/dashboard'
  return '/employee/dashboard'
}

function passwordHint(password: string) {
  return password.length >= 10 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);
}

export function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('SIGN_IN')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', requestedRole: 'EMPLOYEE' as Role, code: '' })

  const passwordValid = useMemo(() => passwordHint(form.password), [form.password])
  if (!auth.loading && auth.user) return <Navigate to={destination(auth.user.role)} replace />

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function run(action: () => Promise<void>) {
    setBusy(true); setError(''); setMessage('')
    try { await action() } catch (e) { setError((e as Error).message || 'Something went wrong.') } finally { setBusy(false) }
  }

  async function handleSignIn() {
    await run(async () => {
      await auth.signInWithPassword(form.email, form.password)
      const refreshed = auth.user
      navigate(refreshed ? destination(refreshed.role) : '/')
    })
  }

  async function handleSignUp() {
    if (!passwordValid) return setError('Use at least 10 characters with upper/lowercase, a number and a special character.')
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.')
    await run(async () => {
      const next = await auth.register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password, requestedRole: form.requestedRole })
      if (next === 'CONFIRM_SIGN_UP') { setMode('CONFIRM'); setMessage('We sent a verification code to your email.') }
      else { setMode('SIGN_IN'); setMessage('Account created. You can sign in now.') }
    })
  }

  async function handleConfirm() {
    await run(async () => {
      await auth.confirmRegistration(form.email, form.code)
      setMode('SIGN_IN'); setMessage('Email verified. Sign in to continue.')
    })
  }

  async function handleForgot() {
    await run(async () => {
      await auth.requestPasswordReset(form.email)
      setMode('RESET'); setMessage('A password reset code has been sent to your email.')
    })
  }

  async function handleReset() {
    if (!passwordValid) return setError('Your new password does not meet the password policy.')
    await run(async () => {
      await auth.completePasswordReset(form.email, form.code, form.password)
      setMode('SIGN_IN'); setMessage('Password updated. Sign in with your new password.')
    })
  }

  const title = mode === 'SIGN_UP' ? 'Create your employee account' : mode === 'CONFIRM' ? 'Verify your email' : mode === 'FORGOT' ? 'Reset your password' : mode === 'RESET' ? 'Choose a new password' : 'Welcome back'
  const subtitle = mode === 'SIGN_IN' ? 'Sign in with your corporate email to continue.' : mode === 'SIGN_UP' ? 'Create a secure account and request the portal role you need.' : 'Complete the security step below.'

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: 'linear-gradient(135deg, #EEF3FF 0%, #F8FAFD 45%, #E8F7F3 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
      <Box sx={{ position: 'absolute', width: 460, height: 460, borderRadius: '50%', bgcolor: 'rgba(52,85,209,.11)', filter: 'blur(3px)', top: -190, left: -170 }} />
      <Box sx={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', bgcolor: 'rgba(12,139,121,.10)', bottom: -170, right: -100 }} />
      <Container maxWidth="xl" sx={{ minHeight: '100vh', display: 'grid', alignItems: 'center', py: { xs: 3, md: 5 }, position: 'relative' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(360px,.9fr) minmax(480px,1.1fr)' }, gap: { xs: 3, lg: 7 }, alignItems: 'center' }}>
          <Box sx={{ display: { xs: 'none', lg: 'block' }, px: 2 }}>
            <Chip icon={<BusinessCenter />} label="Employee Operations Platform" sx={{ mb: 3, bgcolor: 'rgba(52,85,209,.1)', color: 'primary.dark' }} />
            <Typography variant="h3" sx={{ maxWidth: 620 }}>One secure place for people, approvals and everyday work.</Typography>
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: 18,
                lineHeight: 1.7,
                mt: 2.5,
                maxWidth: 600
              }}>
              A modern employee experience for teams to manage profiles, time off, company updates and manager approvals from any device.
            </Typography>
            <Stack spacing={2} sx={{
              mt: 4
            }}>
              {[
                ['Secure authentication', 'Amazon Cognito handles registration, verification and sessions.'],
                ['Role-aware experience', 'Employee, manager and administrator access is controlled separately.'],
                ['Responsive by design', 'Optimized navigation and content for phones, tablets and desktops.'],
              ].map(([heading, text]) => <Stack
                key={heading}
                direction="row"
                sx={{
                  gap: 1.5,
                  alignItems: "flex-start"
                }}><CheckCircle color="secondary" sx={{ mt: .2 }} /><Box><Typography sx={{
                fontWeight: 800
              }}>{heading}</Typography><Typography variant="body2" sx={{
                color: "text.secondary"
              }}>{text}</Typography></Box></Stack>)}
            </Stack>
            <Card sx={{ mt: 5, maxWidth: 580, bgcolor: 'rgba(255,255,255,.68)', backdropFilter: 'blur(14px)' }}><CardContent><Stack direction="row" spacing={2} sx={{
              alignItems: "center"
            }}><ShieldOutlined color="primary" /><Box><Typography sx={{
              fontWeight: 800
            }}>Role requests are not permissions</Typography><Typography variant="body2" sx={{
              color: "text.secondary"
            }}>Manager and Admin requests require Cognito group approval before privileged pages become available.</Typography></Box></Stack></CardContent></Card>
          </Box>

          <Card sx={{ width: '100%', maxWidth: 620, justifySelf: 'center', borderRadius: { xs: 3, sm: 5 }, boxShadow: '0 30px 80px rgba(31,51,89,.14)' }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 4.5 } }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3
                }}>
                <Box><Typography variant="h6" sx={{
                  color: "primary.main"
                }}>Employee Ops</Typography><Typography variant="caption" sx={{
                  color: "text.secondary"
                }}>Corporate Portal</Typography></Box>
                <Chip icon={<LockOutlined />} label="Cognito secured" size="small" variant="outlined" />
              </Stack>

              {(mode !== 'SIGN_IN' && mode !== 'SIGN_UP') && <IconButton onClick={() => { setMode('SIGN_IN'); setError(''); setMessage('') }} sx={{ mb: 1, ml: -1 }}><ArrowBack /></IconButton>}
              <Typography variant="h4" sx={{
                fontSize: { xs: 27, sm: 34 }
              }}>{title}</Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  mt: 1,
                  mb: 3
                }}>{subtitle}</Typography>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

              {mode === 'SIGN_IN' && <Stack spacing={2.2}>
                <TextField fullWidth label="Corporate email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} slotProps={{
                  input: { startAdornment: <MailOutlined sx={{ mr: 1, color: 'text.secondary' }} /> }
                }} />
                <TextField fullWidth label="Password" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void handleSignIn() }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end"
                  }}><Button size="small" onClick={() => setMode('FORGOT')}>Forgot password?</Button></Box>
                <Button size="large" variant="contained" onClick={() => void handleSignIn()} disabled={busy || !form.email || !form.password}>{busy ? <CircularProgress size={22} color="inherit" /> : 'Sign in securely'}</Button>
                <Divider><Typography variant="caption" sx={{
                  color: "text.secondary"
                }}>New to the portal?</Typography></Divider>
                <Button size="large" variant="outlined" onClick={() => { setMode('SIGN_UP'); setError(''); setMessage('') }}>Create account</Button>
              </Stack>}

              {mode === 'SIGN_UP' && <Stack spacing={2.2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}><TextField fullWidth label="First name" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} /><TextField fullWidth label="Last name" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} /></Stack>
                <TextField fullWidth label="Corporate email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
                <Box><Typography
                  sx={{
                    fontWeight: 800,
                    mb: 1.2
                  }}>Which role do you need?</Typography><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.2 }}>{roles.map((item) => <Card key={item.role} onClick={() => update('requestedRole', item.role)} sx={{ cursor: 'pointer', boxShadow: 'none', border: '1px solid', borderColor: form.requestedRole === item.role ? 'primary.main' : 'divider', bgcolor: form.requestedRole === item.role ? 'rgba(52,85,209,.055)' : 'background.paper', transition: '.2s', '&:hover': { borderColor: 'primary.light', transform: 'translateY(-2px)' } }}><CardContent sx={{ p: '14px !important' }}><Box sx={{
                  color: form.requestedRole === item.role ? 'primary.main' : 'text.secondary'
                }}>{item.icon}</Box><Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: 14
                  }}>{item.title}</Typography><Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    display: "block",
                    minHeight: 42
                  }}>{item.description}</Typography>{item.approval && <Chip label={item.approval} size="small" sx={{ mt: 1, fontSize: 10 }} />}</CardContent></Card>)}</Box></Box>
                <TextField fullWidth label="Password" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} helperText="10+ chars, upper/lowercase, number and special character" />
                <TextField fullWidth label="Confirm password" type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} />
                <Alert severity="info">Your requested role is recorded. New accounts receive Employee access by default. Manager/Admin access is granted only after an administrator adds you to the matching Cognito group.</Alert>
                <Button size="large" variant="contained" onClick={() => void handleSignUp()} disabled={busy || !form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword}>{busy ? <CircularProgress size={22} color="inherit" /> : 'Create secure account'}</Button>
                <Button onClick={() => setMode('SIGN_IN')}>Already have an account? Sign in</Button>
              </Stack>}

              {mode === 'CONFIRM' && <Stack spacing={2}><TextField fullWidth label="Email" value={form.email} disabled /><TextField fullWidth label="6-digit verification code" value={form.code} onChange={(e) => update('code', e.target.value)} slotProps={{
                htmlInput: { inputMode: 'numeric' }
              }} /><Button size="large" variant="contained" onClick={() => void handleConfirm()} disabled={busy || !form.code}>Verify account</Button><Button onClick={() => void run(async () => { await auth.resendConfirmation(form.email); setMessage('A new verification code was sent.') })}>Resend code</Button></Stack>}

              {mode === 'FORGOT' && <Stack spacing={2}><TextField fullWidth label="Corporate email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} /><Button size="large" variant="contained" onClick={() => void handleForgot()} disabled={busy || !form.email}>Send reset code</Button></Stack>}

              {mode === 'RESET' && <Stack spacing={2}><TextField fullWidth label="Verification code" value={form.code} onChange={(e) => update('code', e.target.value)} /><TextField fullWidth label="New password" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} helperText="10+ chars, upper/lowercase, number and special character" /><Button size="large" variant="contained" onClick={() => void handleReset()} disabled={busy || !form.code || !form.password}>Update password</Button></Stack>}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
