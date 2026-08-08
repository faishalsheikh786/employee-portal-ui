import { useEffect, useState } from 'react'
import { appConfig } from '../config'
import type { RealtimeNotification } from '../types'
import { fetchAuthSession } from 'aws-amplify/auth'

export function useNotifications(employeeId?: number) {
  const [latest, setLatest] = useState<RealtimeNotification | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!employeeId) return

    const socket = new WebSocket(`${appConfig.wsBase}/notifications/${employeeId}`)
    socket.onopen = async () => {
      try {
        const session = await fetchAuthSession()

        const token =
          session.tokens?.accessToken?.toString()

        if (!token) {
          socket.close()
          return
        }

        socket.send(
          JSON.stringify({
            type: 'AUTH',
            access_token: token,
          }),
        )
      } catch {
        socket.close()
      }
    }
    socket.onclose = () => setConnected(false)
    socket.onerror = () => setConnected(false)
    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)

        if (payload.type === 'AUTH_OK') {
          setConnected(true)
          return
        }

        setLatest(payload)
      } catch {
        setLatest({
          type: 'MESSAGE',
          message: String(event.data),
        })
      }
    }

    const keepAlive = window.setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) socket.send('ping')
    }, 25000)

    return () => {
      window.clearInterval(keepAlive)
      socket.close()
    }
  }, [employeeId])

  return { latest, connected, clear: () => setLatest(null) }
}
