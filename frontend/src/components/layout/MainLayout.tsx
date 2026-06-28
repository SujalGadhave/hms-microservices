import React, { useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, Typography, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Avatar, Divider, Tooltip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventIcon from '@mui/icons-material/Event';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import InventoryIcon from '@mui/icons-material/Inventory';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import ScienceIcon from '@mui/icons-material/Science';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InsertChartIcon from '@mui/icons-material/InsertChart';

const drawerWidth = 260;

type NavItem = { text: string; path: string; icon: React.ReactNode };

const getNavItems = (role: string): NavItem[] => {
  switch (role) {
    case 'ROLE_SUPERADMIN':
      return [
        { text: 'Super Admin Panel',    path: '/superadmin',          icon: <AdminPanelSettingsIcon /> },
        { text: 'User Management',      path: '/superadmin/users',    icon: <PeopleIcon /> },
        { text: 'System Analytics',     path: '/superadmin/analytics',icon: <BarChartIcon /> },
        { text: 'Laboratory',           path: '/superadmin/laboratory',icon: <ScienceIcon /> },
        { text: 'Pharmacy',             path: '/superadmin/pharmacy', icon: <LocalPharmacyIcon /> },
        { text: 'Audit Logs',           path: '/superadmin/audit',    icon: <AssuredWorkloadIcon /> },
        { text: 'Billing & Finance',    path: '/superadmin/billing',  icon: <ReceiptIcon /> },
        { text: 'Doctor Portal',        path: '/superadmin/doctor',   icon: <LocalHospitalIcon /> },
        { text: 'Reporting',            path: '/superadmin/reporting',icon: <InsertChartIcon /> },
      ];
    case 'ROLE_ADMIN':
      return [
        { text: 'Dashboard',            path: '/admin',               icon: <DashboardIcon /> },
        { text: 'Patients',             path: '/admin/patients',      icon: <PeopleIcon /> },
        { text: 'Appointments',         path: '/admin/appointments',  icon: <EventIcon /> },
        { text: 'Analytics',            path: '/admin/analytics',     icon: <BarChartIcon /> },
      ];
    case 'ROLE_DOCTOR':
      return [
        { text: 'Doctor Portal',        path: '/doctor',              icon: <LocalHospitalIcon /> },
      ];
    case 'ROLE_NURSE':
      return [
        { text: 'Nurse Station',        path: '/nurse',               icon: <VaccinesIcon /> },
      ];
    case 'ROLE_VENDOR':
      return [
        { text: 'Vendor Portal',        path: '/vendor',              icon: <InventoryIcon /> },
      ];
    case 'ROLE_PATIENT':
    default:
      return [
        { text: 'Patient Portal',       path: '/patient',             icon: <AccountCircleIcon /> },
      ];
  }
};

const ROLE_COLORS: Record<string, string> = {
  ROLE_SUPERADMIN: '#ef4444',
  ROLE_ADMIN:      '#0ea5e9',
  ROLE_DOCTOR:     '#8b5cf6',
  ROLE_NURSE:      '#10b981',
  ROLE_VENDOR:     '#f59e0b',
  ROLE_PATIENT:    '#06b6d4',
};

const ROLE_LABELS: Record<string, string> = {
  ROLE_SUPERADMIN: 'Super Admin',
  ROLE_ADMIN:      'Administrator',
  ROLE_DOCTOR:     'Doctor',
  ROLE_NURSE:      'Nurse',
  ROLE_VENDOR:     'Vendor',
  ROLE_PATIENT:    'Patient',
};

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userRole      = localStorage.getItem('userRole') ?? '';
  const userEmail     = localStorage.getItem('userEmail') ?? '';
  const userFirstName = localStorage.getItem('userFirstName') ?? '';
  const userLastName  = localStorage.getItem('userLastName') ?? '';
  const displayName   = userFirstName ? `${userFirstName} ${userLastName}`.trim() : userEmail.split('@')[0];

  const roleColor = ROLE_COLORS[userRole] ?? '#64748b';
  const roleLabel = ROLE_LABELS[userRole] ?? userRole;

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // [FIX] Call backend to revoke the refresh token before clearing localStorage.
        await fetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // Fail silently — still clear local storage and redirect
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userFirstName');
      localStorage.removeItem('userLastName');
      navigate('/login');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { navigate('/login'); return; }
    try {
      // Only validate expiry — do NOT decode payload for business data.
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Malformed token');
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('accessToken');
        navigate('/login');
      }
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  const navItems = useMemo(() => getNavItems(userRole), [userRole]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          background: 'rgba(15,23,42,0.85)',
          backdropFilter: 'blur(12px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap sx={{ fontWeight: 700, background: 'linear-gradient(90deg, #0ea5e9, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            HMS — Hospital Management System
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ px: 1.5, py: 0.5, borderRadius: '20px', bgcolor: `${roleColor}18`, border: `1px solid ${roleColor}33` }}>
              <Typography variant="caption" sx={{ color: roleColor, fontWeight: 700, letterSpacing: '0.05em' }}>
                {roleLabel}
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: roleColor, width: 34, height: 34, fontSize: 13, fontWeight: 700 }}>
              {displayName.substring(0, 2).toUpperCase()}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'rgba(15,23,42,0.97)',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            pb: 2,
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box>
          {/* Branding */}
          <Toolbar sx={{ my: 1, gap: 1.5 }}>
            <Box sx={{ width: 38, height: 38, borderRadius: '10px', background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LocalHospitalIcon sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'white', lineHeight: 1.2 }}>
                HMS Portal
              </Typography>
              <Typography variant="caption" sx={{ color: '#475569', lineHeight: 1 }}>
                Healthcare Management
              </Typography>
            </Box>
          </Toolbar>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 1 }} />

          <List sx={{ px: 1.5 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <ListItemButton
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: '10px',
                    mb: 0.5,
                    background: isActive ? `${roleColor}18` : 'transparent',
                    borderLeft: isActive ? `3px solid ${roleColor}` : '3px solid transparent',
                    '&:hover': { background: 'rgba(255,255,255,0.04)' },
                    transition: 'all 0.15s ease'
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? roleColor : '#475569', minWidth: 38 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: isActive ? '#fff' : '#94a3b8', fontWeight: isActive ? 600 : 400, fontSize: '0.875rem' }}>
                        {item.text}
                      </Typography>
                    }
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* Footer: user info + logout */}
        <Box sx={{ px: 1.5 }}>
          <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.05)' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, px: 1 }}>
            <Avatar sx={{ bgcolor: roleColor, width: 36, height: 36, fontSize: 13, fontWeight: 700 }}>
              {displayName.substring(0, 2).toUpperCase()}
            </Avatar>
            <Box sx={{ overflow: 'hidden', flex: 1 }}>
              <Typography variant="body2" noWrap sx={{ color: 'white', fontWeight: 600 }}>
                {displayName}
              </Typography>
              <Typography variant="caption" noWrap sx={{ color: '#475569' }}>
                {userEmail}
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Signs you out and revokes your session token" placement="top">
            <ListItemButton
              id="sidebar-logout"
              onClick={handleLogout}
              sx={{
                borderRadius: '10px',
                color: '#ef4444',
                '&:hover': { background: 'rgba(239,68,68,0.08)' }
              }}
            >
              <ListItemIcon sx={{ color: '#ef4444', minWidth: 38 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={<Typography sx={{ color: '#ef4444', fontWeight: 600, fontSize: '0.875rem' }}>Sign Out</Typography>} />
            </ListItemButton>
          </Tooltip>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          pt: 11,
          minHeight: '100vh',
          background: 'radial-gradient(circle at 100% 0%, rgba(139,92,246,0.08) 0%, transparent 40%), radial-gradient(circle at 0% 100%, rgba(14,165,233,0.08) 0%, transparent 40%), #0a1120'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;