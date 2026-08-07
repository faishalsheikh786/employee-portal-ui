import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppShell from './components/AppShell'
import DashboardPage from './pages/DashboardPage'
import EmployeesPage from './pages/EmployeesPage'
import LeavePage from './pages/LeavePage'

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/employees', element: <EmployeesPage /> },
      { path: '/leave', element: <LeavePage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
