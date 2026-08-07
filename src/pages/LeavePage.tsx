import { useState } from 'react'
import {
  Alert,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { workflowApi } from '../api/client'
import type { LeaveRequest } from '../types'

const employeeId = 1
const managerId = 2

export default function LeavePage() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    leave_type: 'VACATION',
    start_date: '',
    end_date: '',
    reason: '',
  })

  const leaves = useQuery<LeaveRequest[]>({
    queryKey: ['leaves', employeeId],
    queryFn: () => workflowApi.leaves(employeeId) as Promise<LeaveRequest[]>,
  })

  const createLeave = useMutation({
    mutationFn: () =>
      workflowApi.createLeave({
        employee_id: employeeId,
        manager_id: managerId,
        ...form,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves', employeeId] })
      setForm({ leave_type: 'VACATION', start_date: '', end_date: '', reason: '' })
    },
  })

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight={700} mb={2}>Submit Leave Request</Typography>
          <Stack spacing={2}>
            <TextField
              select
              label="Leave type"
              value={form.leave_type}
              onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
            >
              <MenuItem value="VACATION">Vacation</MenuItem>
              <MenuItem value="SICK">Sick</MenuItem>
              <MenuItem value="PERSONAL">Personal</MenuItem>
            </TextField>
            <TextField
              type="date"
              label="Start date"
              InputLabelProps={{ shrink: true }}
              value={form.start_date}
              onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            />
            <TextField
              type="date"
              label="End date"
              InputLabelProps={{ shrink: true }}
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            />
            <TextField
              multiline
              minRows={3}
              label="Reason"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
            {createLeave.isError && <Alert severity="error">Unable to submit request.</Alert>}
            <Button
              variant="contained"
              disabled={!form.start_date || !form.end_date || createLeave.isPending}
              onClick={() => createLeave.mutate()}
            >
              Submit request
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>Request History</Typography>
          <Stack spacing={1}>
            {leaves.data?.map((leave) => (
              <Alert key={leave.id} severity={leave.status === 'APPROVED' ? 'success' : 'info'}>
                {leave.leave_type}: {leave.start_date} → {leave.end_date} — {leave.status}
              </Alert>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
