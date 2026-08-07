const directoryBase =
  import.meta.env.VITE_DIRECTORY_API_BASE_URL || '/api/directory'
const workflowBase =
  import.meta.env.VITE_WORKFLOW_API_BASE_URL || '/api/workflows'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(body || `Request failed with ${response.status}`)
  }

  return response.json() as Promise<T>
}

export const directoryApi = {
  employees: () => request(`${directoryBase}/employees`),
  announcements: () => request(`${directoryBase}/announcements`),
}

export const workflowApi = {
  leaves: (employeeId?: number) =>
    request(`${workflowBase}/leaves${employeeId ? `?employee_id=${employeeId}` : ''}`),
  createLeave: (payload: {
    employee_id: number
    manager_id: number
    leave_type: string
    start_date: string
    end_date: string
    reason: string
  }) =>
    request(`${workflowBase}/leaves`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}
