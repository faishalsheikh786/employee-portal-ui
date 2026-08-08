import { Navigate, Route, Routes } from 'react-router'
import { AppShell } from './components/AppShell'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { useAuth } from './auth/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { AnnouncementsAdminPage } from './pages/admin/AnnouncementsAdminPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { EmployeesAdminPage } from './pages/admin/EmployeesAdminPage'
import { AnnouncementsPage } from './pages/common/AnnouncementsPage'
import { DirectoryPage } from './pages/common/DirectoryPage'
import { NotFoundPage } from './pages/common/NotFoundPage'
import { NotificationsPage } from './pages/common/NotificationsPage'
import { EmployeeDashboardPage } from './pages/employee/EmployeeDashboardPage'
import { LeavePage } from './pages/employee/LeavePage'
import { ProfilePage } from './pages/employee/ProfilePage'
import { ApprovalsPage } from './pages/manager/ApprovalsPage'
import { ManagerDashboardPage } from './pages/manager/ManagerDashboardPage'
import { TeamPage } from './pages/manager/TeamPage'

function HomeRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'EMPLOYEE') return <Navigate to="/employee/dashboard" replace />
  if (user.role === 'MANAGER') return <Navigate to="/manager/dashboard" replace />
  return <Navigate to="/admin/dashboard" replace />
}

export default function App() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<HomeRedirect />} />
    <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
      <Route path="/employee/dashboard" element={<ProtectedRoute roles={['EMPLOYEE']}><EmployeeDashboardPage /></ProtectedRoute>} />
      <Route path="/employee/profile" element={<ProtectedRoute roles={['EMPLOYEE']}><ProfilePage /></ProtectedRoute>} />
      <Route path="/employee/directory" element={<ProtectedRoute roles={['EMPLOYEE']}><DirectoryPage /></ProtectedRoute>} />
      <Route path="/employee/leave" element={<ProtectedRoute roles={['EMPLOYEE']}><LeavePage /></ProtectedRoute>} />
      <Route path="/employee/announcements" element={<ProtectedRoute roles={['EMPLOYEE']}><AnnouncementsPage /></ProtectedRoute>} />
      <Route path="/employee/notifications" element={<ProtectedRoute roles={['EMPLOYEE']}><NotificationsPage /></ProtectedRoute>} />

      <Route path="/manager/dashboard" element={<ProtectedRoute roles={['MANAGER']}><ManagerDashboardPage /></ProtectedRoute>} />
      <Route path="/manager/team" element={<ProtectedRoute roles={['MANAGER']}><TeamPage /></ProtectedRoute>} />
      <Route path="/manager/approvals" element={<ProtectedRoute roles={['MANAGER']}><ApprovalsPage /></ProtectedRoute>} />
      <Route path="/manager/directory" element={<ProtectedRoute roles={['MANAGER']}><DirectoryPage /></ProtectedRoute>} />
      <Route path="/manager/announcements" element={<ProtectedRoute roles={['MANAGER']}><AnnouncementsPage /></ProtectedRoute>} />
      <Route path="/manager/notifications" element={<ProtectedRoute roles={['MANAGER']}><NotificationsPage /></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboardPage /></ProtectedRoute>} />
      <Route path="/admin/employees" element={<ProtectedRoute roles={['ADMIN']}><EmployeesAdminPage /></ProtectedRoute>} />
      <Route path="/admin/directory" element={<ProtectedRoute roles={['ADMIN']}><DirectoryPage /></ProtectedRoute>} />
      <Route path="/admin/announcements" element={<ProtectedRoute roles={['ADMIN']}><AnnouncementsAdminPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
}
