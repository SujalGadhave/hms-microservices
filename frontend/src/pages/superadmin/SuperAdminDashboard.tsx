import { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert, CircularProgress, Switch,
  Tooltip, Tabs, Tab
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';

interface SystemUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  enabled: boolean;
}

const ROLE_OPTIONS = [
  { value: 'ROLE_SUPERADMIN', label: 'Super Administrator' },
  { value: 'ROLE_ADMIN',   label: 'Administrator' },
  { value: 'ROLE_DOCTOR',  label: 'Doctor' },
  { value: 'ROLE_NURSE',   label: 'Nurse' },
  { value: 'ROLE_STAFF',   label: 'Staff' },
  { value: 'ROLE_VENDOR',  label: 'Vendor' },
  { value: 'ROLE_PATIENT', label: 'Patient' },
];

const ROLE_COLORS: Record<string, string> = {
  ROLE_SUPERADMIN: '#ef4444',
  ROLE_ADMIN:      '#0ea5e9',
  ROLE_DOCTOR:     '#8b5cf6',
  ROLE_NURSE:      '#10b981',
  ROLE_STAFF:      '#ec4899',
  ROLE_VENDOR:     '#f59e0b',
  ROLE_PATIENT:    '#06b6d4',
};

const SuperAdminDashboard = () => {
  const firstName   = localStorage.getItem('userFirstName') ?? '';
  const lastName    = localStorage.getItem('userLastName') ?? '';
  const userEmail   = localStorage.getItem('userEmail') ?? '';
  const displayName = firstName ? `${firstName} ${lastName}`.trim() : userEmail.split('@')[0];

  const [users, setUsers]     = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    firstName: '', lastName: '', email: '', password: '', role: 'ROLE_DOCTOR'
  });
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('ALL');

  const token = localStorage.getItem('accessToken') ?? '';

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/v1/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
      const data: SystemUser[] = await res.json();
      setUsers(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleEnabled = async (userId: string) => {
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/toggle-enabled`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to update user status');
      const updated = await res.json();
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, enabled: updated.enabled === 'true' } : u));
      setSuccess(`User account ${updated.enabled === 'true' ? 'enabled' : 'disabled'} successfully`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update user');
    }
  };

  const handleCreateUser = async () => {
    setCreateError('');
    const { firstName, lastName, email, password, role } = createForm;
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setCreateError('All fields are required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setCreateError('Enter a valid email address');
      return;
    }
    if (password.length < 8) {
      setCreateError('Password must be at least 8 characters');
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ firstName, lastName, email, password, role }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setCreateError(d.message || 'Failed to create user');
        return;
      }
      setSuccess(`User "${firstName} ${lastName}" created successfully as ${role}`);
      setTimeout(() => setSuccess(''), 4000);
      setCreateOpen(false);
      setCreateForm({ firstName: '', lastName: '', email: '', password: '', role: 'ROLE_DOCTOR' });
      fetchUsers();
    } catch {
      setCreateError('Network error. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const roleCount = ROLE_OPTIONS.reduce((acc, r) => {
    acc[r.value] = users.filter(u => u.role === r.value).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Welcome, {displayName}</Typography>
          <Typography variant="subtitle1" sx={{ color: '#ef4444', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AdminPanelSettingsIcon fontSize="small" /> Super Administrator Panel
          </Typography>
        </Box>
        <Button
          id="create-user-btn"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setCreateOpen(true); setCreateError(''); }}
          sx={{ background: 'linear-gradient(90deg, #ef4444, #8b5cf6)', fontWeight: 700 }}
        >
          Create Staff Account
        </Button>
      </Box>

      {error   && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {/* Role Distribution Cards */}
      <Grid container spacing={3}>
        {ROLE_OPTIONS.map((r) => (
          <Grid key={r.value} size={{ xs: 6, md: 3 }}>
            <Card sx={{ background: 'rgba(30,41,59,0.4)', border: `1px solid ${ROLE_COLORS[r.value]}22` }}>
              <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: ROLE_COLORS[r.value] }}>
                  {roleCount[r.value] ?? 0}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {r.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Users Table */}
      <Card sx={{ background: 'rgba(30,41,59,0.4)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon sx={{ color: '#0ea5e9' }} /> System Users ({users.length})
            </Typography>
            <Button size="small" variant="outlined" onClick={fetchUsers} disabled={loading} sx={{ borderColor: 'rgba(255,255,255,0.15)', color: '#94a3b8' }}>
              {loading ? <CircularProgress size={16} /> : 'Refresh'}
            </Button>
          </Box>
          <Tabs
            value={currentTab}
            onChange={(e, v) => setCurrentTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3, borderBottom: '1px solid rgba(255,255,255,0.05)', minHeight: 48, '& .MuiTab-root': { fontWeight: 600 } }}
          >
            <Tab label={`All (${users.length})`} value="ALL" sx={{ color: currentTab === 'ALL' ? 'white' : '#94a3b8' }} />
            {ROLE_OPTIONS.map(r => (
              <Tab 
                key={r.value} 
                label={`${r.label}s (${roleCount[r.value] ?? 0})`} 
                value={r.value} 
                sx={{ color: currentTab === r.value ? ROLE_COLORS[r.value] : '#94a3b8' }} 
              />
            ))}
          </Tabs>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress sx={{ color: '#0ea5e9' }} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {users.length === 0 && (
                <Typography sx={{ textAlign: 'center', color: '#64748b', py: 4 }}>
                  No users found. Create the first user using the button above.
                </Typography>
              )}
              {ROLE_OPTIONS.filter(r => currentTab === 'ALL' || currentTab === r.value).map((r) => {
                const roleUsers = users.filter((u) => u.role === r.value);
                if (roleUsers.length === 0) return null;
                return (
                  <Box key={r.value}>
                    <Typography variant="subtitle1" sx={{ color: ROLE_COLORS[r.value], fontWeight: 700, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 1 }}>
                      {r.label}s <Chip label={roleUsers.length} size="small" sx={{ height: 20, bgcolor: `${ROLE_COLORS[r.value]}20`, color: ROLE_COLORS[r.value], fontWeight: 700 }} />
                    </Typography>
                    <TableContainer sx={{ background: 'rgba(0,0,0,0.2)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ '& th': { borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8', fontWeight: 600, py: 1.5 } }}>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Account Status</TableCell>
                            <TableCell align="right">Toggle</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {roleUsers.map((u) => (
                            <TableRow key={u.id} sx={{ '& td': { borderBottom: '1px solid rgba(255,255,255,0.02)' }, '&:last-child td': { borderBottom: 'none' }, '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                              <TableCell sx={{ color: 'white', fontWeight: 600, py: 1.5 }}>{u.firstName} {u.lastName}</TableCell>
                              <TableCell sx={{ color: '#94a3b8' }}>{u.email}</TableCell>
                              <TableCell>
                                <Chip
                                  label={u.enabled ? 'Active' : 'Disabled'}
                                  size="small"
                                  sx={{ bgcolor: u.enabled ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: u.enabled ? '#34d399' : '#f87171', fontWeight: 600, height: 22 }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Tooltip title={u.enabled ? 'Disable account' : 'Enable account'}>
                                  <Switch
                                    checked={u.enabled}
                                    onChange={() => handleToggleEnabled(u.id)}
                                    size="small"
                                    color="success"
                                    slotProps={{ input: { 'aria-label': `Toggle ${u.email} account` } }}
                                  />
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Create Staff Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create Staff Account</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {createError && <Alert severity="error" sx={{ mb: 2 }}>{createError}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="First Name" fullWidth required value={createForm.firstName} onChange={(e) => setCreateForm(f => ({ ...f, firstName: e.target.value }))} />
              <TextField label="Last Name" fullWidth required value={createForm.lastName} onChange={(e) => setCreateForm(f => ({ ...f, lastName: e.target.value }))} />
            </Box>
            <TextField label="Email Address" type="email" fullWidth required value={createForm.email} onChange={(e) => setCreateForm(f => ({ ...f, email: e.target.value }))} />
            <TextField label="Temporary Password" type="password" fullWidth required helperText="Min. 8 chars with uppercase, lowercase, and a number" value={createForm.password} onChange={(e) => setCreateForm(f => ({ ...f, password: e.target.value }))} />
            <TextField label="Role" select fullWidth value={createForm.role} slotProps={{ select: { native: true } }} onChange={(e) => setCreateForm(f => ({ ...f, role: e.target.value }))}>
              {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setCreateOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button
            id="create-user-save"
            variant="contained"
            onClick={handleCreateUser}
            disabled={creating}
            sx={{ background: 'linear-gradient(90deg, #ef4444, #8b5cf6)', minWidth: 120 }}
          >
            {creating ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Create Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuperAdminDashboard;
