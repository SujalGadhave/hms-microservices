import { Box, Typography, Button, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';

const ROLE_REDIRECT: Record<string, string> = {
  ROLE_SUPERADMIN: '/superadmin',
  ROLE_ADMIN:      '/admin',
  ROLE_DOCTOR:     '/doctor',
  ROLE_NURSE:      '/nurse',
  ROLE_VENDOR:     '/vendor',
  ROLE_PATIENT:    '/patient',
};

const Unauthorized = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole') ?? '';
  const userHome = ROLE_REDIRECT[role] ?? '/login';

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 50%, rgba(239,68,68,0.1) 0%, transparent 60%), #0f172a'
    }}>
      <Paper sx={{
        p: 6,
        maxWidth: 480,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        textAlign: 'center',
        background: 'rgba(15,23,42,0.8)',
        border: '1px solid rgba(239,68,68,0.2)',
        backdropFilter: 'blur(24px)',
      }}>
        <Box sx={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(239,68,68,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid rgba(239,68,68,0.3)'
        }}>
          <LockOutlinedIcon sx={{ fontSize: 40, color: '#ef4444' }} />
        </Box>

        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#ef4444', mb: 1 }}>403</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>Access Denied</Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8', lineHeight: 1.7 }}>
            You don't have permission to view this page. Your current role is{' '}
            <Box component="span" sx={{ color: '#0ea5e9', fontWeight: 600 }}>
              {role || 'unknown'}
            </Box>.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            id="unauthorized-go-home"
            variant="contained"
            onClick={() => navigate(userHome)}
            sx={{ background: 'linear-gradient(90deg, #0ea5e9, #8b5cf6)', fontWeight: 600 }}
          >
            Go to My Dashboard
          </Button>
          <Button
            id="unauthorized-go-login"
            variant="outlined"
            onClick={() => {
              localStorage.clear();
              navigate('/login');
            }}
            sx={{ borderColor: 'rgba(255,255,255,0.15)', color: '#94a3b8' }}
          >
            Sign Out & Switch Account
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Unauthorized;
