import { NotificationsActive } from '@mui/icons-material'
import { Alert, Card, CardContent, CircularProgress, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { useEffect, useState } from 'react'
import { workflowApi } from '../../api/workflowApi'
import { useAuth } from '../../auth/AuthContext'
import { PageHeader } from '../../components/PageHeader'
import type { Notification } from '../../types'

export function NotificationsPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    if (!user?.employeeId) { setLoading(false); return }
    workflowApi.notifications(user.employeeId).then(setItems).catch((e: Error) => setError(e.message)).finally(() => setLoading(false))
  }, [user?.employeeId])

  return <>
    <PageHeader title="Notifications" subtitle="Workflow events delivered to your employee account." />
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    <Card variant="outlined"><CardContent>{loading ? <CircularProgress /> : <List>{items.length === 0 && <ListItem><ListItemText primary="No notifications yet" /></ListItem>}{items.map((item) => <ListItem key={item.id} divider><ListItemIcon><NotificationsActive color="primary" /></ListItemIcon><ListItemText primary={item.message} secondary={`${item.event_type} • ${new Date(item.created_at).toLocaleString()}`} /></ListItem>)}</List>}</CardContent></Card>
  </>
}
