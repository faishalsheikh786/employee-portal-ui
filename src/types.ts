export type Role = 'EMPLOYEE' | 'MANAGER' | 'ADMIN'

export interface PortalUser {
  id: string
  employeeId?: number
  managerId?: number
  name: string
  email: string
  role: Role
  requestedRole: Role
  roleApproved: boolean
  groups: string[]
  title: string
}

export interface Employee {
  id: number
  employee_number: string
  first_name: string
  last_name: string
  email: string
  job_title: string
  department: string
  manager_id: number | null
  location: string
  status: string
}

export interface EmployeeCreate {
  employee_number: string
  first_name: string
  last_name: string
  email: string
  job_title: string
  department: string
  manager_id: number | null
  location: string
}

export interface Announcement {
  id: number
  title: string
  message: string
  created_at: string
}

export interface LeaveRequest {
  id: number
  employee_id: number
  manager_id: number
  leave_type: string
  start_date: string
  end_date: string
  reason: string
  status: string
  created_at: string
}

export interface LeaveCreate {
  employee_id: number
  manager_id: number
  leave_type: string
  start_date: string
  end_date: string
  reason: string
}

export interface Notification {
  id: number
  employee_id: number
  event_type: string
  message: string
  created_at: string
}

export interface RealtimeNotification {
  type: string
  message: string
  entity_id?: number
}
