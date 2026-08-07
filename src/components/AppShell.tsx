import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Badge,
  IconButton,
} from '@mui/material'
import {
  DashboardOutlined,
  PeopleOutline,
  EventNoteOutlined,
  NotificationsOutlined,
} from '@mui/icons-material'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const drawerWidth = 240

const links = [
  { label: 'Dashboard', path: '/', icon: <DashboardOutlined /> },
  { label: 'Directory', path: '/employees', icon: <PeopleOutline /> },
  { label: 'Leave Requests', path: '/leave', icon: <EventNoteOutlined /> },
]

export default function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f6f8fb' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Employee Operations Portal
          </Typography>
          <IconButton color="inherit" aria-label="notifications">
            <Badge color="error" variant="dot">
              <NotificationsOutlined />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List>
          {links.map((link) => (
            <ListItemButton
              key={link.path}
              selected={location.pathname === link.path}
              onClick={() => navigate(link.path)}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}
