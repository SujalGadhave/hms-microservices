import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Fade, RadioGroup, FormControlLabel, Radio, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@astraea.com');
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', email);
      setLoading(false);
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'doctor') {
        navigate('/doctor');
      } else {
        navigate('/patient');
      }
    }, 1000);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRole(val);
    if (val === 'admin') {
      setEmail('admin@astraea.com');
    } else if (val === 'doctor') {
      setEmail('dr.smith@astraea.com');
    } else {
      setEmail('john.doe@astraea.com');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)' }}>
      <Fade in={true} timeout={1000}>
        <Paper sx={{ p: 5, width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 3, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'rgba(14, 165, 233, 0.2)', filter: 'blur(40px)', borderRadius: '50%' }} />
          <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 150, height: 150, background: 'rgba(139, 92, 246, 0.2)', filter: 'blur(40px)', borderRadius: '50%' }} />
          
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center', mb: 1, background: 'linear-gradient(45deg, #0ea5e9, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center', mb: 2 }}>
            Access the Astraea Hospital Management System
          </Typography>
          
          <Box sx={{ background: 'rgba(255,255,255,0.02)', p: 2, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Typography variant="subtitle2" sx={{ color: '#0ea5e9', fontWeight: 600, mb: 1 }}>Simulate Portal Role</Typography>
            <RadioGroup row value={role} onChange={handleRoleChange} sx={{ justifyContent: 'space-between' }}>
              <FormControlLabel value="admin" control={<Radio size="small" color="primary" />} label={<Typography variant="body2">Admin</Typography>} />
              <FormControlLabel value="doctor" control={<Radio size="small" color="secondary" />} label={<Typography variant="body2">Doctor</Typography>} />
              <FormControlLabel value="patient" control={<Radio size="small" color="primary" />} label={<Typography variant="body2">Patient</Typography>} />
            </RadioGroup>
          </Box>
          
          <TextField 
            label="Email Address" 
            variant="outlined" 
            fullWidth 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField 
            label="Password" 
            type="password" 
            variant="outlined" 
            fullWidth 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          
          <Button 
            variant="contained" 
            size="large" 
            fullWidth 
            onClick={handleSignIn} 
            disabled={loading}
            sx={{ mt: 1, py: 1.5, background: 'linear-gradient(45deg, #0ea5e9, #8b5cf6)', position: 'relative' }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Sign In'
            )}
          </Button>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Login;