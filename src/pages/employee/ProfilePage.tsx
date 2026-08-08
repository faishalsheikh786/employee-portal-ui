import { Business, Email, LocationOn, Person } from '@mui/icons-material'
import { Alert, Avatar, Card, CardContent, CircularProgress, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { directoryApi } from '../../api/directoryApi'
import { useAuth } from '../../auth/AuthContext'
import { PageHeader } from '../../components/PageHeader'
import { StatusChip } from '../../components/StatusChip'
import type { Employee } from '../../types'

export function ProfilePage() {
  const { user } = useAuth()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { if (user?.employeeId) directoryApi.employee(user.employeeId).then(setEmployee).catch((e: Error) => setError(e.message)) }, [user?.employeeId])
  return <>
    <PageHeader title="My Profile" subtitle="Your directory profile and employment information." />
    {error && <Alert severity="error">{error}</Alert>}
    {!employee && !error ? <CircularProgress /> : employee && <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}><Card variant="outlined"><CardContent sx={{ textAlign: 'center', py: 4 }}><Avatar sx={{ width: 88, height: 88, mx: 'auto', mb: 2, fontSize: 30 }}>{employee.first_name[0]}{employee.last_name[0]}</Avatar><Typography variant="h5">{employee.first_name} {employee.last_name}</Typography><Typography color="text.secondary">{employee.job_title}</Typography><Typography variant="body2" mt={1}>{employee.employee_number}</Typography><StatusChip status={employee.status} /></CardContent></Card></Grid>
      <Grid size={{ xs: 12, md: 8 }}><Card variant="outlined"><CardContent><Typography variant="h6">Employment details</Typography><Divider sx={{ my: 2 }} /><List><ListItem><ListItemIcon><Email /></ListItemIcon><ListItemText primary="Email" secondary={employee.email} /></ListItem><ListItem><ListItemIcon><Business /></ListItemIcon><ListItemText primary="Department" secondary={employee.department} /></ListItem><ListItem><ListItemIcon><LocationOn /></ListItemIcon><ListItemText primary="Location" secondary={employee.location} /></ListItem><ListItem><ListItemIcon><Person /></ListItemIcon><ListItemText primary="Manager ID" secondary={employee.manager_id || 'Not assigned'} /></ListItem></List></CardContent></Card></Grid>
    </Grid>}
  </>
}
