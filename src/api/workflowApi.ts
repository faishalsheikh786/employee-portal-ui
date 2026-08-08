import { appConfig } from '../config'
import type { LeaveCreate, LeaveRequest, Notification } from '../types'
import { requestJson } from './http'

export const workflowApi = {
  health: () => requestJson<{ service: string; status: string }>(`${appConfig.workflowApiBase}/health`),
  leaves: (employeeId?: number) => requestJson<LeaveRequest[]>(
    `${appConfig.workflowApiBase}/leaves${employeeId ? `?employee_id=${employeeId}` : ''}`,
  ),
  createLeave: (payload: LeaveCreate) => requestJson<LeaveRequest>(`${appConfig.workflowApiBase}/leaves`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  updateLeaveStatus: (id: number, status: string) => requestJson<LeaveRequest>(`${appConfig.workflowApiBase}/leaves/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  notifications: (employeeId: number) => requestJson<Notification[]>(`${appConfig.workflowApiBase}/notifications/${employeeId}`),
}
