import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import EquipmentListPage from './pages/EquipmentListPage'
import EquipmentFormPage from './pages/EquipmentFormPage'
import EquipmentDetailsPage from './pages/EquipmentDetailsPage'
import ProtectedRoute from './components/ProtectedRoute'
import EquipmentEditPage from './pages/EquipmentEditPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <EquipmentListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/equipments/new"
        element={
          <ProtectedRoute>
            <EquipmentFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/equipments/:id"
        element={
          <ProtectedRoute>
            <EquipmentDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route path="/equipments/:id/edit" element={<EquipmentEditPage />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
