import { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MedicationIcon from '@mui/icons-material/Medication';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

interface PatientAppointment {
  id: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending';
}

const initialPatientAppointments: PatientAppointment[] = [
  { id: '1', doctorName: 'Dr. Gregory House', specialization: 'Neurologist', date: '2026-06-20', time: '11:30 AM', status: 'Pending' },
  { id: '2', doctorName: 'Dr. Sarah Connor', specialization: 'Surgeon', date: '2026-06-25', time: '10:00 AM', status: 'Confirmed' },
];

const PatientDashboard = () => {
  // Read user data from localStorage — set by the server at login, never from JWT decode
  const firstName = localStorage.getItem('userFirstName') ?? '';
  const lastName  = localStorage.getItem('userLastName') ?? '';
  const userEmail = localStorage.getItem('userEmail') ?? '';
  const displayName = firstName ? `${firstName} ${lastName}`.trim() : userEmail.split('@')[0];

  const [appointments, setAppointments] = useState<PatientAppointment[]>(initialPatientAppointments);
  const [open, setOpen] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [booking, setBooking] = useState({
    doctorName: '',
    specialization: '',
    date: '',
    time: ''
  });

  const handleBookAppointment = () => {
    setBookingError('');
    if (!booking.doctorName.trim() || !booking.date) {
      setBookingError('Doctor name and date are required');
      return;
    }
    const newApt: PatientAppointment = {
      id: crypto.randomUUID(),
      doctorName: booking.doctorName,
      specialization: booking.specialization || 'General Practitioner',
      date: booking.date,
      time: booking.time || '09:00',
      status: 'Pending'
    };
    setAppointments(prev => [...prev, newApt]);
    setOpen(false);
    setBooking({ doctorName: '', specialization: '', date: '', time: '' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Welcome, {displayName}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#10b981', fontWeight: 500 }}>
            Patient Portal
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<CalendarMonthIcon />}
          onClick={() => setOpen(true)}
          sx={{ background: 'linear-gradient(90deg, #10b981, #0ea5e9)' }}
        >
          Book Appointment
        </Button>
      </Box>

      {/* Stats row */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
              <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(16,185,129,0.1)' }}>
                <EventAvailableIcon sx={{ fontSize: 32, color: '#10b981' }} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>My Appointments</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{appointments.length} Scheduled</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
              <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(14,165,233,0.1)' }}>
                <MedicationIcon sx={{ fontSize: 32, color: '#0ea5e9' }} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Active Prescriptions</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>2 Active</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
              <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(245,158,11,0.1)' }}>
                <ReceiptLongIcon sx={{ fontSize: 32, color: '#f59e0b' }} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Outstanding Balance</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>$140.00</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Appointments list */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ background: 'rgba(30,41,59,0.4)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>My Appointments</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ borderBottom: '2px solid rgba(255,255,255,0.05)' }}>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Doctor</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Date / Time</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((apt) => (
                      <TableRow key={apt.id}>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{apt.doctorName}</Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>{apt.specialization}</Typography>
                        </TableCell>
                        <TableCell sx={{ color: '#94a3b8' }}>
                          <Typography variant="body2">{apt.date}</Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>{apt.time}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={apt.status}
                            size="small"
                            sx={{
                              bgcolor: apt.status === 'Confirmed' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                              color: apt.status === 'Confirmed' ? '#34d399' : '#fbbf24',
                              fontWeight: 600
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Prescriptions */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ background: 'rgba(30,41,59,0.4)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Active Prescriptions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { name: 'Lisinopril 10mg', note: 'Dr. Gregory House • Take 1 daily', refills: 3 },
                  { name: 'Atorvastatin 20mg', note: 'Dr. Sarah Connor • Take at bedtime', refills: 1 },
                ].map((rx) => (
                  <Box key={rx.name} sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>{rx.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>{rx.note}</Typography>
                    </Box>
                    <Chip label={`Refills: ${rx.refills}`} size="small" sx={{ bgcolor: 'rgba(14,165,233,0.15)', color: '#38bdf8' }} />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Book Appointment Dialog */}
      <Dialog 
        open={open} 
        onClose={() => { setOpen(false); setBookingError(''); }} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(15,23,42,0.85)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            color: 'white',
            overflow: 'hidden'
          }
        }}
      >
        {/* Decorative glow in dialog */}
        <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'rgba(16,185,129,0.15)', filter: 'blur(40px)', borderRadius: '50%', pointerEvents: 'none' }} />
        
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', background: 'linear-gradient(90deg, #10b981, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', zIndex: 1 }}>
          Book an Appointment
        </DialogTitle>
        <DialogContent sx={{ p: 3, zIndex: 1 }}>
          {bookingError && <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>{bookingError}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              label="Doctor Name"
              fullWidth
              required
              value={booking.doctorName}
              onChange={(e) => setBooking({ ...booking, doctorName: e.target.value })}
              slotProps={{ htmlInput: { 'aria-label': 'Doctor Name' } }}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } } }}
            />
            <TextField
              label="Specialization"
              fullWidth
              placeholder="e.g. Cardiology"
              value={booking.specialization}
              onChange={(e) => setBooking({ ...booking, specialization: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } } }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Preferred Date"
                type="date"
                fullWidth
                required
                slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: new Date().toISOString().split('T')[0] } }}
                value={booking.date}
                onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } } }}
              />
              <TextField
                label="Preferred Time"
                type="time"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                value={booking.time}
                onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } } }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4, zIndex: 1 }}>
          <Button onClick={() => { setOpen(false); setBookingError(''); }} sx={{ color: '#94a3b8', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" onClick={handleBookAppointment} sx={{ background: 'linear-gradient(90deg, #10b981, #0ea5e9)', fontWeight: 700, px: 4, '&:hover': { background: 'linear-gradient(90deg, #059669, #0284c7)' } }}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientDashboard;