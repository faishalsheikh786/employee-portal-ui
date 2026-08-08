import type { PortalUser } from '../types'

export const mockUsers: PortalUser[] = [
  {
    id: 'employee-demo',
    employeeId: 1,
    managerId: 2,
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    role: 'EMPLOYEE',
    title: 'Software Engineer',
  },
  {
    id: 'manager-demo',
    employeeId: 2,
    name: 'Maya Patel',
    email: 'maya.patel@example.com',
    role: 'MANAGER',
    title: 'Engineering Manager',
  },
  {
    id: 'admin-demo',
    name: 'Portal Administrator',
    email: 'admin@example.com',
    role: 'ADMIN',
    title: 'System Administrator',
  },
]
