import { appConfig } from '../config'
import type { Announcement, Employee, EmployeeCreate } from '../types'
import { requestJson } from './http'

export const directoryApi = {
  health: () => requestJson<{ service: string; status: string }>(`${appConfig.directoryApiBase}/health`),
  employees: () => requestJson<Employee[]>(`${appConfig.directoryApiBase}/employees`),
  employee: (id: number) => requestJson<Employee>(`${appConfig.directoryApiBase}/employees/${id}`),
  createEmployee: (payload: EmployeeCreate) => requestJson<Employee>(`${appConfig.directoryApiBase}/employees`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  announcements: () => requestJson<Announcement[]>(`${appConfig.directoryApiBase}/announcements`),
}
