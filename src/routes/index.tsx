import { Navigate } from 'react-router-dom'
import { getCredentials } from '@/lib/credentials'
import { ChatPage } from '@/pages/Chat'
import { LoginPage } from '@/pages/Login'

export const LoginRoute = () => {
  if (getCredentials()) {
    return <Navigate to="/" replace />
  }
  return <LoginPage />
}

export const ProtectedChatRoute = () => {
  const credentials = getCredentials()
  if (!credentials) {
    return <Navigate to="/login" replace />
  }
  return <ChatPage credentials={credentials} />
}
