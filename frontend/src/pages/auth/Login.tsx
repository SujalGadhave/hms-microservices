import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Fade, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }
    // email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.message || 'Invalid credentials');
        return;
      }
      const { accessToken, refreshToken } = await response.json();
      
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userRole', payload.role);
      localStorage.setItem('userEmail', email);
      navigate(payload.role === 'ROLE_ADMIN' || payload.role === 'admin' ? '/admin'
             : payload.role === 'ROLE_DOCTOR' || payload.role === 'doctor' ? '/doctor' : '/patient');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) handleSignIn();
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
          
          <Box component="form" onSubmit={(e: React.FormEvent<HTMLBoxElement>) => { e.preventDefault(); handleSignIn(); }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField 
              label="Email Address" 
              variant="outlined" 
              fullWidth 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              onKeyDown={handleKeyDown}
            />
            <TextField 
              label="Password" 
              type="password" 
              variant="outlined" 
              fullWidth 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              onKeyDown={handleKeyDown}
              error={!!error}
              helperText={error}
              inputProps={{ 'aria-label': 'Password', 'aria-describedby': 'login-error' }}
            />
            
            <Button 
              type="submit"
              variant="contained" 
              size="large" 
              fullWidth 
              disabled={loading}
              sx={{ mt: 1, py: 1.5, background: 'linear-gradient(45deg, #0ea5e9, #8b5cf6)', position: 'relative' }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Login;