import { Navigate, useLocation } from 'react-router-dom'
import { authService } from '../../services/auth'

interface Props {
  children: JSX.Element
  roles?: string[]
}

export function ProtectedRoute({ children, roles }: Props) {
  const location = useLocation()

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
