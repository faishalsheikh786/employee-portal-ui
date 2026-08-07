import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { directoryApi } from '../api/client'
import type { Employee } from '../types'

export default function EmployeesPage() {
  const { data = [], isLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: directoryApi.employees as () => Promise<Employee[]>,
  })

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" fontWeight={700} mb={2}>Employee Directory</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Job title</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading && data.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  {employee.first_name} {employee.last_name}
                  <Typography variant="body2" color="text.secondary">{employee.email}</Typography>
                </TableCell>
                <TableCell>{employee.job_title}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.location}</TableCell>
                <TableCell>{employee.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
