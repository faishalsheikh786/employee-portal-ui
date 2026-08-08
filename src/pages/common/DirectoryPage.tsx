import { Search } from '@mui/icons-material'
import { Alert, Avatar, Card, CardContent, CircularProgress, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { directoryApi } from '../../api/directoryApi'
import { PageHeader } from '../../components/PageHeader'
import { StatusChip } from '../../components/StatusChip'
import type { Employee } from '../../types'

export function DirectoryPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    directoryApi.employees().then(setEmployees).catch((e: Error) => setError(e.message)).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => employees.filter((employee) =>
    `${employee.first_name} ${employee.last_name} ${employee.department} ${employee.job_title}`.toLowerCase().includes(query.toLowerCase()),
  ), [employees, query])

  return (
    <>
      <PageHeader title="Employee Directory" subtitle="Find colleagues, departments and reporting information." />
      <TextField value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search employees" sx={{ mb: 2, minWidth: { xs: '100%', sm: 360 } }} slotProps={{
        input: { startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }
      }} />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}. Make sure employee-directory-api is running.</Alert>}
      <Card variant="outlined">
        <CardContent sx={{ p: 0 }}>
          {loading ? <CircularProgress sx={{ m: 4 }} /> : <TableContainer><Table>
            <TableHead><TableRow><TableCell>Employee</TableCell><TableCell>Title</TableCell><TableCell>Department</TableCell><TableCell>Location</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
            <TableBody>{filtered.map((employee) => <TableRow key={employee.id} hover>
              <TableCell><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Avatar>{employee.first_name[0]}{employee.last_name[0]}</Avatar><div><Typography sx={{
                fontWeight: 700
              }}>{employee.first_name} {employee.last_name}</Typography><Typography variant="caption" sx={{
                color: "text.secondary"
              }}>{employee.email}</Typography></div></div></TableCell>
              <TableCell>{employee.job_title}</TableCell><TableCell>{employee.department}</TableCell><TableCell>{employee.location}</TableCell><TableCell><StatusChip status={employee.status} /></TableCell>
            </TableRow>)}</TableBody>
          </Table></TableContainer>}
        </CardContent>
      </Card>
    </>
  );
}
