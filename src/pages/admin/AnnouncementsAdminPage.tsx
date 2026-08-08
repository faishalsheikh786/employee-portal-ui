import { Security } from '@mui/icons-material'
import { Alert, Card, CardContent, Typography } from '@mui/material'
import { AnnouncementsPage } from '../common/AnnouncementsPage'

export function AnnouncementsAdminPage() {
  return <>
    <Alert severity="info" icon={<Security />} sx={{ mb: 3 }}>
      Publishing is intentionally not done directly from React. The current FastAPI create-announcement route requires an internal API key, and putting that secret in Vite would expose it to every browser. When Cognito/JWT authorization is added, create an ADMIN-protected backend endpoint and enable the publish form here.
    </Alert>
    <Card variant="outlined" sx={{ mb: 3 }}><CardContent><Typography variant="h6">Security boundary</Typography><Typography color="text.secondary">Frontend controls improve UX, but backend authorization must decide who is actually allowed to publish announcements.</Typography></CardContent></Card>
    <AnnouncementsPage />
  </>
}
