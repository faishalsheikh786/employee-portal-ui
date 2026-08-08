const directoryApiBase = import.meta.env.VITE_DIRECTORY_API_BASE_URL || '/api/directory'
const workflowApiBase = import.meta.env.VITE_WORKFLOW_API_BASE_URL || '/api/workflows'

function defaultWsBase(): string {
  const configured = import.meta.env.VITE_WS_BASE_URL
  const scheme = window.location.protocol === 'https:' ? 'wss:' : 'ws:'

  if (configured) {
    if (configured.startsWith('ws://') || configured.startsWith('wss://')) return configured
    if (configured.startsWith('/')) return `${scheme}//${window.location.host}${configured}`
  }

  return `${scheme}//${window.location.host}/ws`
}

export const appConfig = {
  directoryApiBase: directoryApiBase.replace(/\/$/, ''),
  workflowApiBase: workflowApiBase.replace(/\/$/, ''),
  wsBase: defaultWsBase().replace(/\/$/, ''),
}
