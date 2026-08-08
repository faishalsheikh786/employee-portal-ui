import { alpha, createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3455D1', dark: '#203997', light: '#6F85E8' },
    secondary: { main: '#0C8B79', dark: '#08695C', light: '#45B6A6' },
    success: { main: '#16845B' },
    warning: { main: '#C77918' },
    error: { main: '#C93C55' },
    background: { default: '#F4F7FB', paper: '#FFFFFF' },
    text: { primary: '#17233C', secondary: '#64718A' },
    divider: '#E5EAF2',
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h3: { fontWeight: 800, letterSpacing: '-0.035em' },
    h4: { fontWeight: 800, letterSpacing: '-0.025em' },
    h5: { fontWeight: 750, letterSpacing: '-0.02em' },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { minWidth: 320 },
        '::selection': { background: '#DCE4FF' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E8EDF5',
          boxShadow: '0 14px 40px rgba(32, 54, 91, 0.07)',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, minHeight: 42, boxShadow: 'none' },
        contained: { boxShadow: '0 8px 22px rgba(52, 85, 209, .22)' },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#fff',
          '&.Mui-focused': { boxShadow: `0 0 0 4px ${alpha('#3455D1', 0.09)}` },
        },
      },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 700 } } },
    MuiTableCell: {
      styleOverrides: {
        head: { color: '#65738E', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.045em' },
      },
    },
  },
})
