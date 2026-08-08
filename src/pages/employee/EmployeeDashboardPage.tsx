import { Campaign, EventAvailable, Groups, Notifications } from '@mui/icons-material'
import { Alert, Card, CardContent, Grid, List, ListItem, ListItemText, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { directoryApi } from '../../api/directoryApi'
import { workflowApi } from '../../api/workflowApi'
import { useAuth } from '../../auth/AuthContext'
import { PageHeader } from '../../components/PageHeader'
import { StatCard } from '../../components/StatCard'
import { StatusChip } from '../../components/StatusChip'
import type { Announcement, Employee, LeaveRequest, Notification } from '../../types'

export function EmployeeDashboardPage() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.employeeId) return
    Promise.all([
      directoryApi.employees(),
      workflowApi.leaves(user.employeeId),
      directoryApi.announcements(),
      workflowApi.notifications(user.employeeId),
    ]).then(([people, leaveItems, news, noticeItems]) => {
      setEmployees(people); setLeaves(leaveItems); setAnnouncements(news); setNotifications(noticeItems)
    }).catch((e: Error) => setError(e.message))
  }, [user?.employeeId])

  const pending = leaves.filter((item) => item.status === 'PENDING').length
  return <>
    <PageHeader title={`Welcome, ${user?.name.split(' ')[0]}`} subtitle="Here is your employee operations overview." />
    {error && <Alert severity="warning" sx={{ mb: 2 }}>Some live data could not be loaded: {error}</Alert>}
    <Grid container spacing={2} mb={3}>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard label="Directory" value={employees.length} helper="Employees" icon={<Groups />} /></Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard label="Pending leave" value={pending} helper="Awaiting manager" icon={<EventAvailable />} /></Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard label="Announcements" value={announcements.length} helper="Company updates" icon={<Campaign />} /></Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard label="Notifications" value={notifications.length} helper="Recent workflow events" icon={<Notifications />} /></Grid>
    </Grid>
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 7 }}><Card variant="outlined"><CardContent><Typography variant="h6" mb={1}>Recent leave requests</Typography><List>{leaves.slice(0, 5).map((leave) => <ListItem key={leave.id} divider secondaryAction={<StatusChip status={leave.status} />}><ListItemText primary={`${leave.leave_type} • ${leave.start_date} to ${leave.end_date}`} secondary={leave.reason} /></ListItem>)}{leaves.length === 0 && <ListItem><ListItemText primary="No leave requests yet" /></ListItem>}</List></CardContent></Card></Grid>
      <Grid size={{ xs: 12, lg: 5 }}><Card variant="outlined"><CardContent><Typography variant="h6" mb={1}>Latest announcements</Typography><List>{announcements.slice(0, 4).map((item) => <ListItem key={item.id} divider><ListItemText primary={item.title} secondary={item.message} /></ListItem>)}</List></CardContent></Card></Grid>
    </Grid>
  </>
}
