import { Add } from '@mui/icons-material'
import { Alert, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { workflowApi } from '../../api/workflowApi'
import { useAuth } from '../../auth/AuthContext'
import { PageHeader } from '../../components/PageHeader'
import { StatusChip } from '../../components/StatusChip'
import type { LeaveRequest } from '../../types'

export function LeavePage() {
  const { user } = useAuth()
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ leave_type: 'VACATION', start_date: '', end_date: '', reason: '' })
  const load = useCallback(() => { if (user?.employeeId) workflowApi.leaves(user.employeeId).then(setLeaves).catch((e: Error) => setError(e.message)) }, [user?.employeeId])
  useEffect(load, [load])

  async function submit() {
    if (!user?.employeeId || !user.managerId) return
    try {
      await workflowApi.createLeave({ employee_id: user.employeeId, manager_id: user.managerId, ...form })
      setOpen(false); setForm({ leave_type: 'VACATION', start_date: '', end_date: '', reason: '' }); load()
    } catch (e) { setError((e as Error).message) }
  }

  return <>
    <PageHeader title="Leave Requests" subtitle="Submit and track your time-off requests." action={<Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>New request</Button>} />
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    <Card variant="outlined"><CardContent sx={{ p: 0 }}><TableContainer><Table><TableHead><TableRow><TableCell>Type</TableCell><TableCell>Dates</TableCell><TableCell>Reason</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>{leaves.map((leave) => <TableRow key={leave.id}><TableCell>{leave.leave_type}</TableCell><TableCell>{leave.start_date} → {leave.end_date}</TableCell><TableCell>{leave.reason}</TableCell><TableCell><StatusChip status={leave.status} /></TableCell></TableRow>)}</TableBody></Table></TableContainer></CardContent></Card>
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm"><DialogTitle>New leave request</DialogTitle><DialogContent><Stack spacing={2} mt={1}><TextField select label="Leave type" value={form.leave_type} onChange={(e) => setForm({ ...form, leave_type: e.target.value })}><MenuItem value="VACATION">Vacation</MenuItem><MenuItem value="SICK">Sick</MenuItem><MenuItem value="PERSONAL">Personal</MenuItem></TextField><TextField type="date" label="Start date" InputLabelProps={{ shrink: true }} value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /><TextField type="date" label="End date" InputLabelProps={{ shrink: true }} value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /><TextField label="Reason" multiline rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></Stack></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained" onClick={submit} disabled={!form.start_date || !form.end_date || !form.reason}>Submit</Button></DialogActions></Dialog>
  </>
}
