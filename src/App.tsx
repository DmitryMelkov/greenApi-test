import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginRoute, ProtectedChatRoute } from '@/routes'

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/" element={<ProtectedChatRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
)
