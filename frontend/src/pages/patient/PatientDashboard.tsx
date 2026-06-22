 import { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
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
  const [appointments, setAppointments] = useState<PatientAppointment[]>(initialPatientAppointments);
  const [open, setOpen] = useState(false);
  const [booking, setBooking] = useState({
    doctorName: '',
    specialization: '',
    date: '',
    time: ''
  });

  const handleBookAppointment = () => {
    if (!booking.doctorName || !booking.date) return;
    const newApt: PatientAppointment = {
      id: (appointments.length + 1).toString(),
      doctorName: booking.doctorName,
      specialization: booking.specialization || 'General Practitioner',
      date: booking.date,
      time: booking.time || '09:00 AM',
      status: 'Pending'
    };
    setAppointments([...appointments, newApt]);
    setOpen(false);
    setBooking({
      doctorName: '',
      specialization: '',
      date: '',
      time: ''
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>John Doe</Typography>
          <Typography variant="subtitle1" sx={{ color: '#10b981', fontWeight: 500 }}>Patient ID: APT-4521</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<CalendarMonthIcon />} 
          onClick={() => setOpen(true)}
          sx={{ background: 'linear-gradient(45deg, #10b981, #0ea5e9)' }}
        >
          Book Appointment
        </Button>
      </Box>

      {/* Stats row */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
              <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)' }}>
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
              <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(14, 165, 233, 0.1)' }}>
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
              <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(245, 158, 11, 0.1)' }}>
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
          <Card sx={{ background: 'rgba(30, 41, 59, 0.4)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>My Appointments Queue</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ borderBottom: '2px solid rgba(255,255,255,0.05)' }}>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Doctor</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Date/Time</TableCell>
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
                              bgcolor: apt.status === 'Confirmed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
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

        {/* Prescriptions and invoices */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ background: 'rgba(30, 41, 59, 0.4)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Active Prescriptions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>Lisinopril 10mg</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Dr. Gregory House • Take 1 daily</Typography>
                  </Box>
                  <Chip label="Refills Left: 3" size="small" />
                </Box>
                <Box sx={{ p: 2, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>Atorvastatin 20mg</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Dr. Sarah Connor • Take at bedtime</Typography>
                  </Box>
                  <Chip label="Refills Left: 1" size="small" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Book Appointment</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField 
              label="Doctor Name" 
              fullWidth 
              required
              value={booking.doctorName}
              onChange={(e) => setBooking({ ...booking, doctorName: e.target.value })}
            />
            <TextField 
              label="Specialization" 
              fullWidth 
              placeholder="e.g. Cardiology"
              value={booking.specialization}
              onChange={(e) => setBooking({ ...booking, specialization: e.target.value })}
            />
            <TextField 
              label="Date" 
              type="date"
              fullWidth 
              required
              slotProps={{ inputLabel: { shrink: true } }}
              value={booking.date}
              onChange={(e) => setBooking({ ...booking, date: e.target.value })}
            />
            <TextField 
              label="Preferred Time" 
              type="time"
              fullWidth 
              slotProps={{ inputLabel: { shrink: true } }}
              value={booking.time}
              onChange={(e) => setBooking({ ...booking, time: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button variant="contained" onClick={handleBookAppointment} sx={{ background: 'linear-gradient(45deg, #10b981, #0ea5e9)' }}>Submit Request</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientDashboard;