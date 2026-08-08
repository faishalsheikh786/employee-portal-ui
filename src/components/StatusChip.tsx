import { Chip } from '@mui/material'

export function StatusChip({ status }: { status: string }) {
  const value = status.toUpperCase()
  const color = value === 'APPROVED' || value === 'ACTIVE'
    ? 'success'
    : value === 'REJECTED' || value === 'CANCELLED'
      ? 'error'
      : 'warning'
  return <Chip size="small" label={value} color={color} variant="outlined" />
}
