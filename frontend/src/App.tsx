import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { darkTheme } from './theme';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

const Login = lazy(() => import('./pages/auth/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminPatients = lazy(() => import('./pages/admin/AdminPatients'));
const AdminAppointments = lazy(() => import('./pages/admin/AdminAppointments'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const DoctorDashboard = lazy(() => import('./pages/doctor/DoctorDashboard'));
const PatientDashboard = lazy(() => import('./pages/patient/PatientDashboard'));

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a' }}><CircularProgress sx={{ color: '#0ea5e9' }} /></Box>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/login" replace />} />
              
              <Route element={<ProtectedRoute allowedRoles={['admin', 'ROLE_ADMIN']} />}>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/patients" element={<AdminPatients />} />
                <Route path="admin/appointments" element={<AdminAppointments />} />
                <Route path="admin/analytics" element={<AdminAnalytics />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['doctor', 'ROLE_DOCTOR']} />}>
                <Route path="doctor" element={<DoctorDashboard />} />
              </Route>
              
              <Route element={<ProtectedRoute allowedRoles={['patient', 'ROLE_PATIENT']} />}>
                <Route path="patient" element={<PatientDashboard />} />
              </Route>
              
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;