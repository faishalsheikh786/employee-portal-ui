import { useEffect, useState } from 'react'
import { appConfig } from '../config'
import type { RealtimeNotification } from '../types'

export function useNotifications(employeeId?: number) {
  const [latest, setLatest] = useState<RealtimeNotification | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!employeeId) return

    const socket = new WebSocket(`${appConfig.wsBase}/notifications/${employeeId}`)
    socket.onopen = () => setConnected(true)
    socket.onclose = () => setConnected(false)
    socket.onerror = () => setConnected(false)
    socket.onmessage = (event) => {
      try {
        setLatest(JSON.parse(event.data) as RealtimeNotification)
      } catch {
        setLatest({ type: 'MESSAGE', message: String(event.data) })
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
