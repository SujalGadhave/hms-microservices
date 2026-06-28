import { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert
} from '@mui/material';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import BedIcon from '@mui/icons-material/Bed';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

interface Patient {
  id: string;
  name: string;
  room: string;
  vitals: string;
  medications: string;
  lastChecked: string;
  alert: boolean;
}

const initialPatients: Patient[] = [
  { id: '1', name: 'John Doe',      room: 'Room 304', vitals: 'BP: 130/85, HR: 78', medications: 'Lisinopril 10mg', lastChecked: '10 min ago', alert: false },
  { id: '2', name: 'Emily Davis',   room: 'ICU 102',  vitals: 'BP: 95/60, HR: 112', medications: 'Dopamine IV',    lastChecked: '3 min ago',  alert: true  },
  { id: '3', name: 'Mark Torres',   room: 'Room 201', vitals: 'BP: 120/78, HR: 72', medications: 'Metformin 500mg', lastChecked: '25 min ago', alert: false },
  { id: '4', name: 'Susan Lee',     room: 'Room 115', vitals: 'BP: 145/92, HR: 88', medications: 'Amlodipine 5mg', lastChecked: '1 hr ago',   alert: true  },
];

const NurseDashboard = () => {
  const firstName   = localStorage.getItem('userFirstName') ?? '';
  const lastName    = localStorage.getItem('userLastName') ?? '';
  const userEmail   = localStorage.getItem('userEmail') ?? '';
  const displayName = firstName ? `${firstName} ${lastName}`.trim() : userEmail.split('@')[0];

  const [patients, setPatients]   = useState<Patient[]>(initialPatients);
  const [noteOpen, setNoteOpen]   = useState(false);
  const [noteTarget, setNoteTarget] = useState<Patient | null>(null);
  const [noteText, setNoteText]   = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const alertCount   = patients.filter(p => p.alert).length;
  const bedCount     = patients.length;
  const checkedCount = patients.filter(p => !p.alert).length;

  const handleResolveAlert = (id: string) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, alert: false, lastChecked: 'Just now' } : p));
    setSuccessMsg('Alert resolved successfully');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    setNoteText('');
    setNoteOpen(false);
    setSuccessMsg(`Note logged for ${noteTarget?.name}`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Welcome, {displayName}</Typography>
          <Typography variant="subtitle1" sx={{ color: '#10b981', fontWeight: 500 }}>Nurse Station — Ward Overview</Typography>
        </Box>
        {alertCount > 0 && (
          <Box sx={{ px: 2, py: 1, borderRadius: '12px', bgcolor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <Typography variant="subtitle2" sx={{ color: '#ef4444', fontWeight: 700 }}>
              🚨 {alertCount} Critical Alert{alertCount > 1 ? 's' : ''}
            </Typography>
          </Box>
        )}
      </Box>

      {successMsg && <Alert severity="success">{successMsg}</Alert>}

      {/* Stats */}
      <Grid container spacing={3}>
        {[
          { label: 'Patients Assigned', value: bedCount,    icon: <BedIcon sx={{ fontSize: 32, color: '#0ea5e9' }} />,   bg: 'rgba(14,165,233,0.1)' },
          { label: 'Critical Alerts',   value: alertCount,  icon: <MonitorHeartIcon sx={{ fontSize: 32, color: '#ef4444' }} />, bg: 'rgba(239,68,68,0.1)' },
          { label: 'Checked This Shift', value: checkedCount, icon: <VaccinesIcon sx={{ fontSize: 32, color: '#10b981' }} />, bg: 'rgba(16,185,129,0.1)' },
        ].map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
                <Box sx={{ p: 2, borderRadius: '16px', background: stat.bg }}>{stat.icon}</Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>{stat.label}</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Patient ward table */}
      <Card sx={{ background: 'rgba(30,41,59,0.4)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Ward Patient Monitor</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ borderBottom: '2px solid rgba(255,255,255,0.05)' }}>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Patient</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Room</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Vitals</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Medications</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Last Checked</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((p) => (
                  <TableRow key={p.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' }, background: p.alert ? 'rgba(239,68,68,0.04)' : 'transparent' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>{p.name}</TableCell>
                    <TableCell sx={{ color: '#94a3b8' }}>{p.room}</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>{p.vitals}</TableCell>
                    <TableCell sx={{ color: '#94a3b8' }}>{p.medications}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{p.lastChecked}</TableCell>
                    <TableCell>
                      <Chip
                        label={p.alert ? 'Critical' : 'Stable'}
                        size="small"
                        sx={{
                          bgcolor: p.alert ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                          color:   p.alert ? '#f87171' : '#34d399',
                          fontWeight: 600,
                          animation: p.alert ? 'pulse 2s infinite' : 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        {p.alert && (
                          <Button size="small" variant="contained" color="error" onClick={() => handleResolveAlert(p.id)} sx={{ fontSize: '0.7rem' }}>
                            Resolve
                          </Button>
                        )}
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<AssignmentIcon />}
                          onClick={() => { setNoteTarget(p); setNoteOpen(true); }}
                          sx={{ fontSize: '0.7rem', borderColor: 'rgba(255,255,255,0.15)', color: '#94a3b8' }}
                        >
                          Note
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Clinical Note Dialog */}
      <Dialog open={noteOpen} onClose={() => setNoteOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Clinical Note — {noteTarget?.name}</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            label="Clinical Note"
            multiline
            rows={4}
            fullWidth
            placeholder="Describe observations, medication administered, patient response..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setNoteOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddNote} sx={{ background: 'linear-gradient(90deg, #10b981, #0ea5e9)' }}>
            Save Note
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NurseDashboard;
