import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Avatar, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventIcon from '@mui/icons-material/Event';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 260;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = localStorage.getItem('userRole') || 'admin';
  const userEmail = localStorage.getItem('userEmail') || 'admin@astraea.com';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getNavItems = () => {
    if (userRole === 'admin') {
      return [
        { text: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
        { text: 'Patients', path: '/admin/patients', icon: <PeopleIcon /> },
        { text: 'Appointments', path: '/admin/appointments', icon: <EventIcon /> },
        { text: 'Analytics', path: '/admin/analytics', icon: <BarChartIcon /> },
      ];
    } else if (userRole === 'doctor') {
      return [
        { text: 'Doctor Portal', path: '/doctor', icon: <LocalHospitalIcon /> },
      ];
    } else {
      return [
        { text: 'Patient Portal', path: '/patient', icon: <AccountCircleIcon /> },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          width: `calc(100% - ${drawerWidth}px)`, 
          ml: `${drawerWidth}px`,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600, background: 'linear-gradient(45deg, #0ea5e9, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Astraea Health Portal
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#94a3b8', textTransform: 'capitalize' }}>
              Role: <strong>{userRole}</strong>
            </Typography>
            <Avatar sx={{ bgcolor: userRole === 'admin' ? '#0ea5e9' : userRole === 'doctor' ? '#8b5cf6' : '#10b981', width: 32, height: 32, fontSize: 14 }}>
              {userRole.substring(0, 1).toUpperCase()}
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
            background: 'rgba(30, 41, 59, 0.95)',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            pb: 3
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box>
          <Toolbar sx={{ my: 2 }}>
            <LocalHospitalIcon sx={{ color: '#0ea5e9', mr: 2, fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
              HMS Portal
            </Typography>
          </Toolbar>
          <List sx={{ px: 2 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItemButton 
                  key={item.text} 
                  onClick={() => navigate(item.path)}
                  sx={{ 
                    borderRadius: '10px', 
                    mb: 1, 
                    background: isActive ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                    borderLeft: isActive ? '3px solid #0ea5e9' : '3px solid transparent',
                    '&:hover': { background: 'rgba(255, 255, 255, 0.04)' }
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#0ea5e9' : '#94a3b8', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography sx={{ color: isActive ? '#fff' : '#94a3b8', fontWeight: isActive ? 600 : 500, fontSize: '0.875rem' }}>
                        {item.text}
                      </Typography>
                    } 
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
        <Box sx={{ px: 2 }}>
          <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.05)' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, px: 1 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.05)', width: 36, height: 36 }} />
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" noWrap sx={{ color: 'white', fontWeight: 600 }}>
                {userEmail.split('@')[0]}
              </Typography>
              <Typography variant="caption" noWrap sx={{ color: '#64748b' }}>
                {userEmail}
              </Typography>
            </Box>
          </Box>
          <ListItemButton 
            onClick={handleLogout}
            sx={{ 
              borderRadius: '10px', 
              color: '#ef4444',
              '&:hover': { background: 'rgba(239, 68, 68, 0.1)' }
            }}
          >
            <ListItemIcon sx={{ color: '#ef4444', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </ListItemButton>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 4, pt: 12, minHeight: '100vh', background: 'radial-gradient(circle at 100% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(14, 165, 233, 0.15) 0%, transparent 50%)' }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;