import { Campaign, Groups, PendingActions, TaskAlt } from '@mui/icons-material'
import { Alert, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import { directoryApi } from '../../api/directoryApi'
import { workflowApi } from '../../api/workflowApi'
import { PageHeader } from '../../components/PageHeader'
import { StatCard } from '../../components/StatCard'
import type { Announcement, Employee, LeaveRequest } from '../../types'

export function AdminDashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [error, setError] = useState('')
  useEffect(() => { Promise.all([directoryApi.employees(), workflowApi.leaves(), directoryApi.announcements()]).then(([e, l, a]) => { setEmployees(e); setLeaves(l); setAnnouncements(a) }).catch((e: Error) => setError(e.message)) }, [])
  return <><PageHeader title="Administration" subtitle="Operational overview across employee directory and workflows." />{error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}<Grid container spacing={2}><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard label="Employees" value={employees.length} icon={<Groups />} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard label="Leave requests" value={leaves.length} icon={<TaskAlt />} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard label="Pending workflows" value={leaves.filter((l) => l.status === 'PENDING').length} icon={<PendingActions />} /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard label="Announcements" value={announcements.length} icon={<Campaign />} /></Grid></Grid></>
}
