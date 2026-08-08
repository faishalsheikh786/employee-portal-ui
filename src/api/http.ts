import { fetchAuthSession } from 'aws-amplify/auth'

export async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  let authorization: string | undefined

  try {
    const session = await fetchAuthSession()
    const token = session.tokens?.accessToken?.toString()
    if (token) authorization = `Bearer ${token}`
  } catch {
    // Unauthenticated requests are still useful for health endpoints during local troubleshooting.
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(authorization ? { Authorization: authorization } : {}),
      ...(init?.headers || {}),
    },
  })

  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`
    try {
      const body = await response.json() as { detail?: string }
      if (body.detail) detail = body.detail
    } catch {
      // Keep HTTP status text when response is not JSON.
    }
    throw new Error(detail)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
