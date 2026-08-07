export interface Employee {
  id: number
  employee_number: string
  first_name: string
  last_name: string
  email: string
  job_title: string
  department: string
  manager_id?: number | null
  location: string
  status: string
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

export interface NotificationMessage {
  type: string
  message: string
  entity_id?: number
}
