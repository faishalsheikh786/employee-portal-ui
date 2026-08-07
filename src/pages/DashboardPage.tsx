import { Alert, Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { directoryApi, workflowApi } from '../api/client'
import { useNotifications } from '../hooks/useNotifications'
import type { Announcement, Employee, LeaveRequest } from '../types'

const DEMO_EMPLOYEE_ID = 1

export default function DashboardPage() {
  const employees = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: directoryApi.employees as () => Promise<Employee[]>,
  })
  const leaves = useQuery<LeaveRequest[]>({
    queryKey: ['leaves', DEMO_EMPLOYEE_ID],
    queryFn: () => workflowApi.leaves(DEMO_EMPLOYEE_ID) as Promise<LeaveRequest[]>,
  })
  const announcements = useQuery<Announcement[]>({
    queryKey: ['announcements'],
    queryFn: directoryApi.announcements as () => Promise<Announcement[]>,
  })
  const { notifications, connected } = useNotifications(DEMO_EMPLOYEE_ID)

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={700}>Dashboard</Typography>
        <Typography color="text.secondary">
          Corporate employee operations and workflow overview.
        </Typography>
      </Box>

      <Alert severity={connected ? 'success' : 'warning'}>
        Real-time notification channel: {connected ? 'connected' : 'disconnected'}
      </Alert>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card><CardContent>
            <Typography color="text.secondary">Employees</Typography>
            <Typography variant="h3">{employees.data?.length ?? '—'}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card><CardContent>
            <Typography color="text.secondary">My leave requests</Typography>
            <Typography variant="h3">{leaves.data?.length ?? '—'}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card><CardContent>
            <Typography color="text.secondary">Live notifications</Typography>
            <Typography variant="h3">{notifications.length}</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>Recent notifications</Typography>
          {notifications.length === 0
            ? <Typography color="text.secondary">No live notifications yet.</Typography>
            : notifications.map((item, index) => (
                <Alert key={`${item.type}-${index}`} severity="info" sx={{ mb: 1 }}>
                  {item.message}
                </Alert>
              ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>Company announcements</Typography>
          <Stack spacing={1.5}>
            {announcements.data?.map((item) => (
              <Box key={item.id}>
                <Typography fontWeight={600}>{item.title}</Typography>
                <Typography color="text.secondary">{item.message}</Typography>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>My leave requests</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {leaves.data?.map((leave) => (
              <Chip
                key={leave.id}
                label={`${leave.leave_type}: ${leave.status}`}
                color={leave.status === 'APPROVED' ? 'success' : 'default'}
              />
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
