import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from './theme';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPatients from './pages/admin/AdminPatients';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/patients" element={<AdminPatients />} />
            <Route path="admin/appointments" element={<AdminAppointments />} />
            <Route path="admin/analytics" element={<AdminAnalytics />} />
            <Route path="doctor" element={<DoctorDashboard />} />
            <Route path="patient" element={<PatientDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;