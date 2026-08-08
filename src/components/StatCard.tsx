import { Box, Card, CardContent, Typography } from '@mui/material'
import type { ReactNode } from 'react'

export function StatCard({ label, value, icon, helper }: { label: string; value: string | number; icon: ReactNode; helper?: string }) {
  return <Card sx={{ height: '100%', transition: 'transform .2s, box-shadow .2s', '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 20px 50px rgba(32,54,91,.11)' } }}><CardContent sx={{ p: { xs: 2.2, md: 2.6 } }}><Box display="flex" justifyContent="space-between" alignItems="center" gap={2}><Box minWidth={0}><Typography color="text.secondary" variant="body2" fontWeight={700}>{label}</Typography><Typography variant="h4" mt={.5}>{value}</Typography>{helper && <Typography variant="caption" color="text.secondary">{helper}</Typography>}</Box><Box sx={{ bgcolor: 'rgba(52,85,209,.08)', color: 'primary.main', borderRadius: 3, p: 1.5, display: 'flex' }}>{icon}</Box></Box></CardContent></Card>
}
