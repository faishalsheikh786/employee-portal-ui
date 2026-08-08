import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return <Box display="flex" justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} gap={2} mb={{ xs: 2.5, md: 3.5 }} flexDirection={{ xs: 'column', sm: 'row' }}>
    <Box minWidth={0}><Typography variant="h4" fontSize={{ xs: 27, sm: 31, md: 34 }}>{title}</Typography>{subtitle && <Typography color="text.secondary" mt={.6} fontSize={{ xs: 14, md: 15 }}>{subtitle}</Typography>}</Box>
    {action && <Box sx={{ '& .MuiButton-root': { width: { xs: '100%', sm: 'auto' } } }}>{action}</Box>}
  </Box>
}
