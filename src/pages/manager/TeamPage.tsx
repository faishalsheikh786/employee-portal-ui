import { Alert, Avatar, Card, CardContent, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { directoryApi } from '../../api/directoryApi'
import { useAuth } from '../../auth/AuthContext'
import { PageHeader } from '../../components/PageHeader'
import type { Employee } from '../../types'

export function TeamPage() {
  const { user } = useAuth()
  const [team, setTeam] = useState<Employee[]>([])
  const [error, setError] = useState('')
  useEffect(() => { if (user?.employeeId) directoryApi.employees().then((items) => setTeam(items.filter((employee) => employee.manager_id === user.employeeId))).catch((e: Error) => setError(e.message)) }, [user?.employeeId])
  return (
    <><PageHeader title="My Team" subtitle="Employees who report directly to you." />{error && <Alert severity="error">{error}</Alert>}<Grid container spacing={2}>{team.map((member) => <Grid key={member.id} size={{ xs: 12, md: 6, lg: 4 }}><Card variant="outlined"><CardContent><Avatar sx={{ mb: 2 }}>{member.first_name[0]}{member.last_name[0]}</Avatar><Typography variant="h6">{member.first_name} {member.last_name}</Typography><Typography sx={{
      color: "text.secondary"
    }}>{member.job_title}</Typography><Typography variant="body2" sx={{
      mt: 1
    }}>{member.email}</Typography><Typography variant="body2">{member.location}</Typography></CardContent></Card></Grid>)}</Grid></>
  );
}
