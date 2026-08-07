import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import App from './App'

const queryClient = new QueryClient()

const theme = createTheme({
  palette: {
    primary: { main: '#0b57d0' },
    background: { default: '#f6f8fb' },
  },
  typography: {
    fontFamily: 'Inter, system-ui, Arial, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
