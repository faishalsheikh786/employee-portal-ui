import { Alert, Button, ButtonGroup, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { workflowApi } from '../../api/workflowApi'
import { useAuth } from '../../auth/AuthContext'
import { PageHeader } from '../../components/PageHeader'
import { StatusChip } from '../../components/StatusChip'
import type { LeaveRequest } from '../../types'

export function ApprovalsPage() {
  const { user } = useAuth()
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [error, setError] = useState('')
  const load = useCallback(() => { if (user?.employeeId) workflowApi.leaves().then((items) => setLeaves(items.filter((leave) => leave.manager_id === user.employeeId))).catch((e: Error) => setError(e.message)) }, [user?.employeeId])
  useEffect(load, [load])
  async function update(id: number, status: 'APPROVED' | 'REJECTED') { try { await workflowApi.updateLeaveStatus(id, status); load() } catch (e) { setError((e as Error).message) } }
  return <><PageHeader title="Leave Approvals" subtitle="Review requests assigned to you." />{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}<Card variant="outlined"><CardContent sx={{ p: 0 }}><TableContainer><Table><TableHead><TableRow><TableCell>Employee</TableCell><TableCell>Type</TableCell><TableCell>Dates</TableCell><TableCell>Reason</TableCell><TableCell>Status</TableCell><TableCell>Action</TableCell></TableRow></TableHead><TableBody>{leaves.map((leave) => <TableRow key={leave.id}><TableCell>#{leave.employee_id}</TableCell><TableCell>{leave.leave_type}</TableCell><TableCell>{leave.start_date} → {leave.end_date}</TableCell><TableCell>{leave.reason}</TableCell><TableCell><StatusChip status={leave.status} /></TableCell><TableCell>{leave.status === 'PENDING' && <ButtonGroup size="small"><Button color="success" onClick={() => update(leave.id, 'APPROVED')}>Approve</Button><Button color="error" onClick={() => update(leave.id, 'REJECTED')}>Reject</Button></ButtonGroup>}</TableCell></TableRow>)}</TableBody></Table></TableContainer></CardContent></Card></>
}
