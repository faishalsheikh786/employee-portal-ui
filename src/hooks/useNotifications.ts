import { useEffect, useState } from 'react'
import type { NotificationMessage } from '../types'

function getWebSocketBase(): string {
  const configured = import.meta.env.VITE_WS_BASE_URL
  if (configured) return configured

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${window.location.host}/ws`
}

export function useNotifications(employeeId: number) {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socket = new WebSocket(`${getWebSocketBase()}/notifications/${employeeId}`)

    socket.onopen = () => setConnected(true)
    socket.onclose = () => setConnected(false)
    socket.onerror = () => setConnected(false)
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as NotificationMessage
      setNotifications((current) => [message, ...current].slice(0, 10))
    }

    return () => socket.close()
  }, [employeeId])

  return { notifications, connected }
}
