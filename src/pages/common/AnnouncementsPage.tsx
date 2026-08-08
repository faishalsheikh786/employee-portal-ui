import { Campaign } from '@mui/icons-material'
import { Alert, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { directoryApi } from '../../api/directoryApi'
import { PageHeader } from '../../components/PageHeader'
import type { Announcement } from '../../types'

export function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => { directoryApi.announcements().then(setItems).catch((e: Error) => setError(e.message)).finally(() => setLoading(false)) }, [])
  return (
    <>
      <PageHeader title="Company Announcements" subtitle="Company news and operational updates." />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? <CircularProgress /> : <Stack spacing={2}>{items.map((item) => <Card key={item.id} variant="outlined"><CardContent><Stack direction="row" sx={{
        gap: 2
      }}><Campaign color="primary" /><div><Typography variant="h6">{item.title}</Typography><Typography
        sx={{
          color: "text.secondary",
          mt: 1
        }}>{item.message}</Typography><Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          display: "block",
          mt: 2
        }}>{new Date(item.created_at).toLocaleString()}</Typography></div></Stack></CardContent></Card>)}</Stack>}
    </>
  );
}
