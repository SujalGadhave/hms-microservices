import React, { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Fade, CircularProgress,
  InputAdornment, IconButton, Alert, Divider
} from '@mui/material';
import { Visibility, VisibilityOff, LocalHospital } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSignUp = async () => {
    setError('');
    const { firstName, lastName, email, password, confirmPassword } = form;

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('All fields are required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/.test(password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one digit');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Public registration is always ROLE_PATIENT. Staff accounts are created by an admin.
        body: JSON.stringify({ firstName, lastName, email, password, role: 'ROLE_PATIENT' }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.message || 'Registration failed. Please try again.');
        return;
      }
      // [SECURITY] Read user details directly from server response — no manual JWT decoding.
      const { accessToken, refreshToken, role, email: userEmail, firstName: fn, lastName: ln } = await response.json();
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', userEmail);
      localStorage.setItem('userFirstName', fn ?? '');
      localStorage.setItem('userLastName', ln ?? '');
      navigate('/patient');
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) handleSignUp();
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
      background: 'radial-gradient(circle at 80% 20%, rgba(139,92,246,0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(14,165,233,0.15) 0%, transparent 50%), #0f172a'
    }}>
      <Fade in timeout={800}>
        <Paper sx={{
          p: 5, width: '100%', maxWidth: 500,
          display: 'flex', flexDirection: 'column', gap: 3,
          position: 'relative', overflow: 'hidden',
          background: 'rgba(15,23,42,0.8)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
        }}>
          {/* Glow orbs */}
          <Box sx={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, background: 'rgba(139,92,246,0.15)', filter: 'blur(50px)', borderRadius: '50%', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', bottom: -60, left: -60, width: 180, height: 180, background: 'rgba(14,165,233,0.15)', filter: 'blur(50px)', borderRadius: '50%', pointerEvents: 'none' }} />

          {/* Logo & Title */}
          <Box sx={{ textAlign: 'center', zIndex: 1 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '16px', background: 'linear-gradient(135deg, #8b5cf6, #0ea5e9)', mb: 2, boxShadow: '0 8px 24px rgba(139,92,246,0.35)' }}>
              <LocalHospital sx={{ color: 'white', fontSize: 30 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #8b5cf6, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Patient Registration
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
              Create your HMS patient account
            </Typography>
          </Box>

          <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', zIndex: 1 }}>
            <Typography variant="caption" sx={{ color: '#7dd3fc', lineHeight: 1.6 }}>
              <strong>ℹ️ For Patients Only.</strong> Doctor, nurse, and staff accounts are created by your hospital administrator. Contact IT support if you need a staff account.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ zIndex: 1, bgcolor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); handleSignUp(); }} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, zIndex: 1 }}>
            {/* Name row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                id="register-firstname"
                label="First Name"
                fullWidth
                required
                autoComplete="given-name"
                value={form.firstName}
                onChange={handleChange('firstName')}
                disabled={loading}
                onKeyDown={handleKeyDown}
                slotProps={{ htmlInput: { 'aria-label': 'First Name' } }}
              />
              <TextField
                id="register-lastname"
                label="Last Name"
                fullWidth
                required
                autoComplete="family-name"
                value={form.lastName}
                onChange={handleChange('lastName')}
                disabled={loading}
                onKeyDown={handleKeyDown}
                slotProps={{ htmlInput: { 'aria-label': 'Last Name' } }}
              />
            </Box>

            <TextField
              id="register-email"
              label="Email Address"
              type="email"
              fullWidth
              required
              autoComplete="email"
              value={form.email}
              onChange={handleChange('email')}
              disabled={loading}
              onKeyDown={handleKeyDown}
              slotProps={{ htmlInput: { 'aria-label': 'Email Address' } }}
            />

            <TextField
              id="register-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange('password')}
              disabled={loading}
              onKeyDown={handleKeyDown}
              helperText="Min. 8 chars with uppercase, lowercase, and a number"
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

            <TextField
              id="register-confirm-password"
              label="Confirm Password"
              type={showConfirm ? 'text' : 'password'}
              fullWidth
              required
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              disabled={loading}
              onKeyDown={handleKeyDown}
              slotProps={{
                htmlInput: { 'aria-label': 'Confirm Password' },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirm(v => !v)} edge="end" sx={{ color: '#64748b' }}>
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />

            <Button
              id="register-submit"
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ mt: 1, py: 1.5, background: 'linear-gradient(90deg, #8b5cf6, #0ea5e9)', fontWeight: 700, fontSize: '1rem', '&:hover': { background: 'linear-gradient(90deg, #7c3aed, #0284c7)' } }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Account'}
            </Button>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

            <Typography variant="body2" sx={{ textAlign: 'center', color: '#64748b' }}>
              Already have an account?{' '}
              <Box component="span" onClick={() => navigate('/login')} sx={{ color: '#0ea5e9', cursor: 'pointer', fontWeight: 600, '&:hover': { color: '#8b5cf6', textDecoration: 'underline' } }}>
                Sign In
              </Box>
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Register;
