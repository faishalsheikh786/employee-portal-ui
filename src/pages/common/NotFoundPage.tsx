import { Button, Card, CardContent, Typography } from '@mui/material'
import { Link } from 'react-router'

export function NotFoundPage() {
  return <Card variant="outlined"><CardContent><Typography variant="h4">Page not found</Typography><Typography color="text.secondary" my={2}>The requested portal page does not exist.</Typography><Button component={Link} to="/">Return home</Button></CardContent></Card>
}
