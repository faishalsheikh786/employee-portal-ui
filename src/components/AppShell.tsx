import {
  AdminPanelSettings,
  Apartment,
  Campaign,
  Dashboard,
  EventAvailable,
  Groups,
  Logout,
  ManageAccounts,
  Menu as MenuIcon,
  Notifications,
  Person,
  TaskAlt,
} from '@mui/icons-material'
import {
  Alert,
  AppBar,
  Avatar,
  Badge,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useMemo, useState, type ReactNode } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { useNotifications } from '../hooks/useNotifications'

const drawerWidth = 272
interface NavItem { label: string; path: string; icon: ReactNode }

export function AppShell() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const desktop = useMediaQuery(theme.breakpoints.up('lg'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const realtime = useNotifications(user?.employeeId)

  const navItems = useMemo<NavItem[]>(() => {
    if (!user) return []
    if (user.role === 'EMPLOYEE') return [
      { label: 'Dashboard', path: '/employee/dashboard', icon: <Dashboard /> },
      { label: 'My Profile', path: '/employee/profile', icon: <Person /> },
      { label: 'Directory', path: '/employee/directory', icon: <Groups /> },
      { label: 'Leave Requests', path: '/employee/leave', icon: <EventAvailable /> },
      { label: 'Announcements', path: '/employee/announcements', icon: <Campaign /> },
      { label: 'Notifications', path: '/employee/notifications', icon: <Notifications /> },
    ]
    if (user.role === 'MANAGER') return [
      { label: 'Dashboard', path: '/manager/dashboard', icon: <Dashboard /> },
      { label: 'My Team', path: '/manager/team', icon: <Groups /> },
      { label: 'Approvals', path: '/manager/approvals', icon: <TaskAlt /> },
      { label: 'Directory', path: '/manager/directory', icon: <Apartment /> },
      { label: 'Announcements', path: '/manager/announcements', icon: <Campaign /> },
      { label: 'Notifications', path: '/manager/notifications', icon: <Notifications /> },
    ]
    return [
      { label: 'Admin Dashboard', path: '/admin/dashboard', icon: <AdminPanelSettings /> },
      { label: 'Employees', path: '/admin/employees', icon: <ManageAccounts /> },
      { label: 'Directory', path: '/admin/directory', icon: <Groups /> },
      { label: 'Announcements', path: '/admin/announcements', icon: <Campaign /> },
    ]
  }, [user])

  if (!user) return null

  const drawer = <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', color: 'white', background: 'linear-gradient(180deg,#152A54 0%,#10213F 58%,#0A172D 100%)' }}>
    <Box px={2.5} pt={3} pb={2.5}>
      <Stack direction="row" spacing={1.4} alignItems="center">
        <Box sx={{ width: 42, height: 42, display: 'grid', placeItems: 'center', borderRadius: 2.2, bgcolor: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.14)' }}><Apartment /></Box>
        <Box><Typography fontWeight={900} fontSize={18}>Employee Ops</Typography><Typography variant="caption" sx={{ color: 'rgba(255,255,255,.6)' }}>Corporate Workspace</Typography></Box>
      </Stack>
    </Box>
    <Divider sx={{ borderColor: 'rgba(255,255,255,.09)' }} />
    <Typography variant="overline" sx={{ px: 2.7, pt: 2.5, color: 'rgba(255,255,255,.42)', letterSpacing: '.12em', fontWeight: 800 }}>Workspace</Typography>
    <List sx={{ px: 1.4, pt: .5 }}>
      {navItems.map((item) => {
        const active = location.pathname === item.path
        return <ListItemButton key={item.path} component={Link} to={item.path} onClick={() => setMobileOpen(false)} selected={active} sx={{ borderRadius: 2.5, mb: .55, minHeight: 46, color: active ? '#fff' : 'rgba(255,255,255,.72)', '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 40 }, '&.Mui-selected': { bgcolor: 'rgba(104,132,255,.22)', boxShadow: 'inset 3px 0 0 #8DA0FF' }, '&.Mui-selected:hover': { bgcolor: 'rgba(104,132,255,.27)' }, '&:hover': { bgcolor: 'rgba(255,255,255,.07)', color: '#fff' } }}>
          <ListItemIcon>{item.icon}</ListItemIcon><ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 800 : 600 }} />
        </ListItemButton>
      })}
    </List>
    <Box mt="auto" p={1.7}>
      <Box sx={{ bgcolor: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.09)', p: 1.6, borderRadius: 3 }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Avatar sx={{ width: 38, height: 38, bgcolor: '#6078E8', fontWeight: 800 }}>{user.name.charAt(0).toUpperCase()}</Avatar>
          <Box minWidth={0} flex={1}><Typography variant="body2" fontWeight={800} noWrap>{user.name}</Typography><Typography variant="caption" sx={{ color: 'rgba(255,255,255,.57)' }}>{user.role}</Typography></Box>
          <Tooltip title="Sign out"><IconButton size="small" sx={{ color: 'rgba(255,255,255,.8)' }} onClick={() => void logout().then(() => navigate('/login'))}><Logout fontSize="small" /></IconButton></Tooltip>
        </Stack>
      </Box>
    </Box>
  </Box>

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
        <Drawer variant={desktop ? 'permanent' : 'temporary'} open={desktop || mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { width: drawerWidth, border: 0, boxSizing: 'border-box' } }}>{drawer}</Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, width: { lg: `calc(100% - ${drawerWidth}px)` } }}>
        <AppBar position="sticky" elevation={0} color="inherit" sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'rgba(255,255,255,.88)', backdropFilter: 'blur(18px)' }}>
          <Toolbar sx={{ minHeight: { xs: 64, md: 72 }, gap: 1.2 }}>
            {!desktop && <IconButton edge="start" onClick={() => setMobileOpen(true)}><MenuIcon /></IconButton>}
            <Box minWidth={0} flex={1}>
              <Typography fontWeight={800} noWrap>{user.title}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap display="block">{user.email}</Typography>
            </Box>
            <Stack direction="row" alignItems="center" spacing={{ xs: .5, sm: 1.2 }}>
              <Chip size="small" label={realtime.connected ? 'Live' : 'Offline'} color={realtime.connected ? 'success' : 'default'} variant="outlined" sx={{ display: { xs: 'none', sm: 'inline-flex' } }} />
              <Tooltip title="Notifications"><IconButton><Badge color="error" variant={realtime.latest ? 'dot' : 'standard'}><Notifications /></Badge></IconButton></Tooltip>
              <Chip label={user.role} size="small" color={user.role === 'ADMIN' ? 'secondary' : 'primary'} variant="outlined" sx={{ display: { xs: 'none', md: 'inline-flex' } }} />
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontWeight: 800 }}>{user.name.charAt(0).toUpperCase()}</Avatar>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box sx={{ maxWidth: 1600, mx: 'auto', p: { xs: 2, sm: 2.5, md: 3.5, xl: 4.5 } }}>
          {!user.roleApproved && user.requestedRole !== 'EMPLOYEE' && <Alert severity="info" sx={{ mb: 2.5, borderRadius: 3 }}><strong>{user.requestedRole} access requested.</strong> Your account currently has Employee permissions. An administrator must add you to the {user.requestedRole} Cognito group to enable privileged pages.</Alert>}
          {!user.employeeId && user.role !== 'ADMIN' && <Alert severity="warning" sx={{ mb: 2.5, borderRadius: 3 }}>Your Cognito email is not linked to an employee directory record yet. Ask an administrator to create a directory record using <strong>{user.email}</strong>.</Alert>}
          <Outlet />
        </Box>
      </Box>

      <Snackbar open={Boolean(realtime.latest)} autoHideDuration={6000} onClose={realtime.clear} message={realtime.latest?.message || ''} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
    </Box>
  )
}
