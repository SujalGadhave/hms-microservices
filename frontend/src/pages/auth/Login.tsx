import React, { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Fade, CircularProgress,
  InputAdornment, IconButton, Alert
} from '@mui/material';
import { Visibility, VisibilityOff, LocalHospital } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ROLE_REDIRECT: Record<string, string> = {
  ROLE_SUPERADMIN: '/superadmin',
  ROLE_ADMIN:      '/admin',
  ROLE_DOCTOR:     '/doctor',
  ROLE_NURSE:      '/nurse',
  ROLE_VENDOR:     '/vendor',
  ROLE_PATIENT:    '/patient',
};

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.message || 'Invalid credentials. Please try again.');
        return;
      }
      // [SECURITY] Read role/email/name directly from server response — never decode JWT manually.
      const { accessToken, refreshToken, role, email: userEmail, firstName, lastName } = await response.json();

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', userEmail);
      localStorage.setItem('userFirstName', firstName ?? '');
      localStorage.setItem('userLastName', lastName ?? '');

      const destination = ROLE_REDIRECT[role] ?? '/patient';
      navigate(destination);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) handleSignIn();
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 20% 20%, rgba(139,92,246,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(14,165,233,0.15) 0%, transparent 50%), #0f172a'
    }}>
      <Fade in timeout={800}>
        <Paper sx={{
          p: 5, width: '100%', maxWidth: 460,
          display: 'flex', flexDirection: 'column', gap: 3,
          position: 'relative', overflow: 'hidden',
          background: 'rgba(15,23,42,0.8)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
        }}>
          {/* Glow orbs */}
          <Box sx={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, background: 'rgba(14,165,233,0.15)', filter: 'blur(50px)', borderRadius: '50%', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', bottom: -60, left: -60, width: 180, height: 180, background: 'rgba(139,92,246,0.15)', filter: 'blur(50px)', borderRadius: '50%', pointerEvents: 'none' }} />

          {/* Logo & Title */}
          <Box sx={{ textAlign: 'center', zIndex: 1 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', mb: 2, boxShadow: '0 8px 24px rgba(14,165,233,0.35)' }}>
              <LocalHospital sx={{ color: 'white', fontSize: 30 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #0ea5e9, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              HMS Portal
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
              Hospital Management System — Secure Sign In
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ zIndex: 1, bgcolor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); handleSignIn(); }} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, zIndex: 1 }}>
            <TextField
              id="login-email"
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              onKeyDown={handleKeyDown}
              slotProps={{ htmlInput: { 'aria-label': 'Email Address' } }}
            />
            <TextField
              id="login-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              onKeyDown={handleKeyDown}
              slotProps={{
                htmlInput: { 'aria-label': 'Password' },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(v => !v)} edge="end" sx={{ color: '#64748b' }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />

            <Button
              id="login-submit"
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ mt: 1, py: 1.5, background: 'linear-gradient(90deg, #0ea5e9, #8b5cf6)', fontWeight: 700, fontSize: '1rem', '&:hover': { background: 'linear-gradient(90deg, #0284c7, #7c3aed)' } }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
            </Button>

            <Typography variant="body2" sx={{ textAlign: 'center', color: '#64748b' }}>
              New patient?{' '}
              <Box component="span" onClick={() => navigate('/register')} sx={{ color: '#0ea5e9', cursor: 'pointer', fontWeight: 600, '&:hover': { color: '#8b5cf6', textDecoration: 'underline' } }}>
                Create an account
              </Box>
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Login;