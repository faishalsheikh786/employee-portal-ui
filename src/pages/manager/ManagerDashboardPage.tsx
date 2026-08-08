import { Campaign, Groups, Notifications, TaskAlt } from '@mui/icons-material'
import { Alert, Card, CardContent, Grid, List, ListItem, ListItemText, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { directoryApi } from '../../api/directoryApi'
import { workflowApi } from '../../api/workflowApi'
import { useAuth } from '../../auth/AuthContext'
import { PageHeader } from '../../components/PageHeader'
import { StatCard } from '../../components/StatCard'
import { StatusChip } from '../../components/StatusChip'
import type { Announcement, Employee, LeaveRequest, Notification } from '../../types'

export function ManagerDashboardPage() {
  const { user } = useAuth()
  const [team, setTeam] = useState<Employee[]>([])
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [error, setError] = useState('')
  useEffect(() => {
    if (!user?.employeeId) return
    Promise.all([directoryApi.employees(), workflowApi.leaves(), directoryApi.announcements(), workflowApi.notifications(user.employeeId)])
      .then(([people, allLeaves, news, notices]) => { setTeam(people.filter((p) => p.manager_id === user.employeeId)); setLeaves(allLeaves.filter((l) => l.manager_id === user.employeeId)); setAnnouncements(news); setNotifications(notices) })
      .catch((e: Error) => setError(e.message))
  }, [user?.employeeId])
  const pending = leaves.filter((l) => l.status === 'PENDING')
  return (
    <>
      <PageHeader title="Manager Dashboard" subtitle="Team activity, approvals and operational updates." />
      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={2} sx={{
        mb: 3
      }}><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard label="Direct reports" value={team.length} icon={<Groups />} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard label="Pending approvals" value={pending.length} icon={<TaskAlt />} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard label="Notifications" value={notifications.length} icon={<Notifications />} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard label="Announcements" value={announcements.length} icon={<Campaign />} /></Grid></Grid>
      <Card variant="outlined"><CardContent><Typography variant="h6" sx={{
        mb: 1
      }}>Approval queue</Typography><List>{pending.slice(0, 6).map((leave) => <ListItem key={leave.id} divider secondaryAction={<StatusChip status={leave.status} />}><ListItemText primary={`Employee ${leave.employee_id} • ${leave.leave_type}`} secondary={`${leave.start_date} → ${leave.end_date} • ${leave.reason}`} /></ListItem>)}{pending.length === 0 && <ListItem><ListItemText primary="No pending approvals" /></ListItem>}</List></CardContent></Card>
    </>
  );
}
