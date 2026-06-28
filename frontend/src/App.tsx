import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { darkTheme } from './theme';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

/* ---------- Lazy-loaded pages ---------- */
const Login              = lazy(() => import('./pages/auth/Login'));
const Register           = lazy(() => import('./pages/auth/Register'));
const Unauthorized       = lazy(() => import('./pages/Unauthorized'));

// Admin
const AdminDashboard     = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminPatients      = lazy(() => import('./pages/admin/AdminPatients'));
const AdminAppointments  = lazy(() => import('./pages/admin/AdminAppointments'));
const AdminAnalytics     = lazy(() => import('./pages/admin/AdminAnalytics'));

// Doctor
const DoctorDashboard    = lazy(() => import('./pages/doctor/DoctorDashboard'));

// Nurse
const NurseDashboard     = lazy(() => import('./pages/nurse/NurseDashboard'));

// Patient
const PatientDashboard   = lazy(() => import('./pages/patient/PatientDashboard'));

// Vendor
const VendorDashboard    = lazy(() => import('./pages/vendor/VendorDashboard'));

// Super Admin
const SuperAdminDashboard = lazy(() => import('./pages/superadmin/SuperAdminDashboard'));
const LaboratoryDashboard = lazy(() => import('./pages/superadmin/LaboratoryDashboard'));
const PharmacyDashboard   = lazy(() => import('./pages/superadmin/PharmacyDashboard'));
const AuditDashboard      = lazy(() => import('./pages/superadmin/AuditDashboard'));
const BillingDashboard    = lazy(() => import('./pages/superadmin/BillingDashboard'));
const ReportingDashboard  = lazy(() => import('./pages/superadmin/ReportingDashboard'));

/* ---------- Global loading fallback ---------- */
const Loader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a' }}>
    <CircularProgress sx={{ color: '#0ea5e9' }} />
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login"        element={<Login />} />
            <Route path="/register"     element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected routes — all share MainLayout (sidebar + topbar) */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/login" replace />} />

              {/* Super Admin */}
              <Route element={<ProtectedRoute allowedRoles={['ROLE_SUPERADMIN']} />}>
                <Route path="superadmin"          element={<SuperAdminDashboard />} />
                <Route path="superadmin/users"    element={<SuperAdminDashboard />} />
                <Route path="superadmin/laboratory" element={<LaboratoryDashboard />} />
                <Route path="superadmin/pharmacy"  element={<PharmacyDashboard />} />
                <Route path="superadmin/audit"     element={<AuditDashboard />} />
                <Route path="superadmin/billing"   element={<BillingDashboard />} />
                <Route path="superadmin/doctor"    element={<DoctorDashboard />} />
                <Route path="superadmin/reporting" element={<ReportingDashboard />} />
                <Route path="superadmin/analytics" element={<AdminAnalytics />} />
              </Route>

              {/* Admin */}
              <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                <Route path="admin"               element={<AdminDashboard />} />
                <Route path="admin/patients"      element={<AdminPatients />} />
                <Route path="admin/appointments"  element={<AdminAppointments />} />
                <Route path="admin/analytics"     element={<AdminAnalytics />} />
              </Route>

              {/* Doctor */}
              <Route element={<ProtectedRoute allowedRoles={['ROLE_DOCTOR']} />}>
                <Route path="doctor" element={<DoctorDashboard />} />
              </Route>

              {/* Nurse */}
              <Route element={<ProtectedRoute allowedRoles={['ROLE_NURSE']} />}>
                <Route path="nurse" element={<NurseDashboard />} />
              </Route>

              {/* Patient */}
              <Route element={<ProtectedRoute allowedRoles={['ROLE_PATIENT']} />}>
                <Route path="patient" element={<PatientDashboard />} />
              </Route>

              {/* Vendor */}
              <Route element={<ProtectedRoute allowedRoles={['ROLE_VENDOR']} />}>
                <Route path="vendor" element={<VendorDashboard />} />
              </Route>
            </Route>

            {/* Catch-all → login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;