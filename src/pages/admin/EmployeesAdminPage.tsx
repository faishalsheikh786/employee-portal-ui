import { Add } from '@mui/icons-material'
import { Alert, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { directoryApi } from '../../api/directoryApi'
import { PageHeader } from '../../components/PageHeader'
import { StatusChip } from '../../components/StatusChip'
import type { Employee, EmployeeCreate } from '../../types'

const emptyForm: EmployeeCreate = { employee_number: '', first_name: '', last_name: '', email: '', job_title: '', department: '', manager_id: null, location: 'Remote' }

export function EmployeesAdminPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [form, setForm] = useState<EmployeeCreate>(emptyForm)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const load = useCallback(() => directoryApi.employees().then(setEmployees).catch((e: Error) => setError(e.message)), [])
  useEffect(load, [load])
  async function create() { try { await directoryApi.createEmployee(form); setForm(emptyForm); setOpen(false); load() } catch (e) { setError((e as Error).message) } }
  return <><PageHeader title="Employee Administration" subtitle="Create and review employee directory records." action={<Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add employee</Button>} />{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}<Card variant="outlined"><CardContent sx={{ p: 0 }}><TableContainer><Table><TableHead><TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Department</TableCell><TableCell>Title</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>{employees.map((employee) => <TableRow key={employee.id}><TableCell>{employee.employee_number}</TableCell><TableCell>{employee.first_name} {employee.last_name}</TableCell><TableCell>{employee.email}</TableCell><TableCell>{employee.department}</TableCell><TableCell>{employee.job_title}</TableCell><TableCell><StatusChip status={employee.status} /></TableCell></TableRow>)}</TableBody></Table></TableContainer></CardContent></Card>
  <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm"><DialogTitle>Create employee</DialogTitle><DialogContent><Stack spacing={2} mt={1}><TextField label="Employee number" value={form.employee_number} onChange={(e) => setForm({ ...form, employee_number: e.target.value })} /><Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}><TextField fullWidth label="First name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /><TextField fullWidth label="Last name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></Stack><TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><TextField label="Job title" value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} /><TextField label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /><TextField label="Manager ID (optional)" type="number" value={form.manager_id ?? ''} onChange={(e) => setForm({ ...form, manager_id: e.target.value ? Number(e.target.value) : null })} /><TextField label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Stack></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained" onClick={create} disabled={!form.employee_number || !form.first_name || !form.last_name || !form.email || !form.job_title || !form.department}>Create</Button></DialogActions></Dialog></>
}
