import { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, InputAdornment, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

const initialAppointments: Appointment[] = [
  { id: 'APT001', patientName: 'John Doe', doctorName: 'Dr. Sarah Connor', date: '2026-06-20', time: '10:00 AM', type: 'General Checkup', status: 'Confirmed' },
  { id: 'APT002', patientName: 'Jane Smith', doctorName: 'Dr. Gregory House', date: '2026-06-20', time: '11:30 AM', type: 'Neurology Consultation', status: 'Pending' },
  { id: 'APT003', patientName: 'Robert Johnson', doctorName: 'Dr. Stephen Strange', date: '2026-06-21', time: '02:00 PM', type: 'Cardiology Review', status: 'Confirmed' },
  { id: 'APT004', patientName: 'Emily Davis', doctorName: 'Dr. Meredith Grey', date: '2026-06-21', time: '04:15 PM', type: 'Pediatric Care', status: 'Cancelled' },
  { id: 'APT005', patientName: 'Michael Wilson', doctorName: 'Dr. Sarah Connor', date: '2026-06-22', time: '09:00 AM', type: 'General Checkup', status: 'Pending' },
];

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [search, setSearch] = useState('');
  const [menuState, setMenuState] = useState<{ anchor: HTMLElement; aptId: string } | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setMenuState({ anchor: event.currentTarget, aptId: id });
  };

  const handleMenuClose = () => {
    setMenuState(null);
  };

  const handleStatusChange = (status: 'Confirmed' | 'Pending' | 'Cancelled') => {
    if (!menuState?.aptId) return;
    const targetId = menuState.aptId;
    setAppointments(prev =>
      prev.map(apt => apt.id === targetId ? { ...apt, status } : apt)
    );
    handleMenuClose();
  };

  const filteredAppointments = appointments.filter(apt =>
    apt.patientName.toLowerCase().includes(search.toLowerCase()) ||
    apt.doctorName.toLowerCase().includes(search.toLowerCase()) ||
    apt.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Appointments Dashboard</Typography>
      </Box>

      <Card sx={{ background: 'rgba(30, 41, 59, 0.4)' }}>
        <CardContent sx={{ p: 3 }}>
          <TextField
            placeholder="Search appointments by Patient, Doctor or ID..."
            variant="outlined"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 3 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748b' }} />
                  </InputAdornment>
                ),
              }
            }}
          />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ borderBottom: '2px solid rgba(255,255,255,0.05)' }}>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Appt ID</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Patient Name</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Assigned Doctor</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Date & Time</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppointments.map((apt) => (
                  <TableRow key={apt.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                    <TableCell sx={{ color: '#0ea5e9', fontWeight: 600 }}>{apt.id}</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>{apt.patientName}</TableCell>
                    <TableCell sx={{ color: '#94a3b8' }}>{apt.doctorName}</TableCell>
                    <TableCell sx={{ color: '#94a3b8' }}>
                      <Typography variant="body2">{apt.date}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>{apt.time}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#94a3b8' }}>{apt.type}</TableCell>
                    <TableCell>
                      <Chip 
                        label={apt.status} 
                        size="small"
                        sx={{ 
                          bgcolor: apt.status === 'Confirmed' ? 'rgba(16, 185, 129, 0.15)' : apt.status === 'Pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: apt.status === 'Confirmed' ? '#34d399' : apt.status === 'Pending' ? '#fbbf24' : '#f87171',
                          fontWeight: 600
                        }} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        sx={{ color: '#94a3b8' }}
                        onClick={(e) => handleMenuOpen(e, apt.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Menu
        anchorEl={menuState?.anchor}
        open={Boolean(menuState)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange('Confirmed')}>
          <ListItemIcon sx={{ color: '#10b981' }}><CheckCircleIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Confirm Appointment</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Pending')}>
          <ListItemIcon sx={{ color: '#f59e0b' }}><HourglassEmptyIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Set to Pending</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Cancelled')}>
          <ListItemIcon sx={{ color: '#ef4444' }}><CancelIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Cancel Appointment</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AdminAppointments;
