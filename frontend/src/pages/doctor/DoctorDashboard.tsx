import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CreateIcon from '@mui/icons-material/Create';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GroupIcon from '@mui/icons-material/Group';

interface AppointmentResponse {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  status: string;
  reasonForVisit: string;
}

interface PageData {
  content: AppointmentResponse[];
  totalPages: number;
}

const DoctorDashboard = () => {
  const firstName = localStorage.getItem('userFirstName') ?? '';
  const lastName  = localStorage.getItem('userLastName') ?? '';
  const userEmail = localStorage.getItem('userEmail') ?? '';
  const displayName = firstName ? `${firstName} ${lastName}`.trim() : userEmail.split('@')[0];
  
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [open, setOpen] = useState(false);
  const [prescription, setPrescription] = useState({
    patientName: '',
    medicine: '',
    dosage: '',
    frequency: 'Once a day'
  });

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      // For demo purposes, we fetch appointments for a dummy doctor ID, or if we had a real one in the token.
      const doctorId = "DOC-123"; 
      const response = await fetch(`/api/v1/appointments?doctorId=${doctorId}&status=SCHEDULED&page=0&size=10`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data: PageData = await response.json();
      setAppointments(data.content || []);
    } catch (err: any) {
      setError(err.message || 'Services might be down. Please run start-services.ps1');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCreatePrescription = async () => {
    if (!prescription.patientName || !prescription.medicine) return;
    alert(`Prescription written successfully for ${prescription.patientName}!\nMedicine: ${prescription.medicine} (${prescription.dosage}), Frequency: ${prescription.frequency}`);
    setOpen(false);
    setPrescription({
      patientName: '',
      medicine: '',
      dosage: '',
      frequency: 'Once a day'
    });
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    // Optimistic update for UI
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
    // Ideally this would call a backend endpoint to update the status.
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{displayName || 'Doctor'}</Typography>
          <Typography variant="subtitle1" sx={{ color: '#0ea5e9', fontWeight: 500 }}>Doctor Portal</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<CreateIcon />} 
          onClick={() => setOpen(true)}
          sx={{ background: 'linear-gradient(45deg, #0ea5e9, #8b5cf6)' }}
        >
          Write Prescription
        </Button>
      </Box>

      {error && <Alert severity="info">Note: {error}. The list below may be empty until the Appointment Service is running and populated.</Alert>}

      {/* Stats row */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
              <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(14, 165, 233, 0.1)' }}>
                <EventAvailableIcon sx={{ fontSize: 32, color: '#0ea5e9' }} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Queue Status</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{appointments.length} Patients</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
              <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(139, 92, 246, 0.1)' }}>
                <GroupIcon sx={{ fontSize: 32, color: '#8b5cf6' }} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Consultations Today</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>0 Visits</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
              <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)' }}>
                <LocalHospitalIcon sx={{ fontSize: 32, color: '#10b981' }} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Active Prescriptions</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>0 Written</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Appointment queue table */}
      <Card sx={{ background: 'rgba(30, 41, 59, 0.4)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Today's Patient Queue</Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress sx={{ color: '#0ea5e9' }} /></Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ borderBottom: '2px solid rgba(255,255,255,0.05)' }}>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Patient Name</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Reason for Visit</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Scheduled Time</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ color: '#94a3b8', py: 4 }}>
                        <LocalHospitalIcon sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
                        <Typography>No appointments currently in queue.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    appointments.map((q) => (
                      <TableRow key={q.id}>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>{q.patientName || 'Unknown Patient'}</TableCell>
                        <TableCell sx={{ color: '#94a3b8' }}>{q.reasonForVisit}</TableCell>
                        <TableCell sx={{ color: '#94a3b8' }}>{new Date(q.startTime).toLocaleTimeString()}</TableCell>
                        <TableCell>
                          <Chip 
                            label={q.status} 
                            size="small"
                            sx={{ 
                              bgcolor: q.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' : q.status === 'IN_PROGRESS' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(14, 165, 233, 0.15)',
                              color: q.status === 'COMPLETED' ? '#34d399' : q.status === 'IN_PROGRESS' ? '#fbbf24' : '#38bdf8',
                              fontWeight: 600
                            }} 
                          />
                        </TableCell>
                        <TableCell align="right">
                          {q.status === 'SCHEDULED' && (
                            <Button variant="outlined" size="small" onClick={() => handleUpdateStatus(q.id, 'IN_PROGRESS')}>
                              Start Consult
                            </Button>
                          )}
                          {q.status === 'IN_PROGRESS' && (
                            <Button variant="contained" color="success" size="small" onClick={() => handleUpdateStatus(q.id, 'COMPLETED')}>
                              Complete
                            </Button>
                          )}
                          {q.status === 'COMPLETED' && (
                            <Typography variant="body2" sx={{ color: '#64748b' }}>Finished</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Write Prescription</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField 
              label="Patient Name" 
              fullWidth 
              required
              value={prescription.patientName}
              onChange={(e) => setPrescription({ ...prescription, patientName: e.target.value })}
            />
            <TextField 
              label="Medicine Name" 
              fullWidth 
              required
              placeholder="e.g. Ibuprofen 400mg"
              value={prescription.medicine}
              onChange={(e) => setPrescription({ ...prescription, medicine: e.target.value })}
            />
            <TextField 
              label="Dosage Instructions" 
              fullWidth 
              placeholder="e.g. Take 1 tablet after meals"
              value={prescription.dosage}
              onChange={(e) => setPrescription({ ...prescription, dosage: e.target.value })}
            />
            <TextField 
              label="Frequency" 
              select 
              fullWidth 
              value={prescription.frequency}
              SelectProps={{ native: true }}
              onChange={(e) => setPrescription({ ...prescription, frequency: e.target.value })}
            >
              <option value="Once a day">Once a day</option>
              <option value="Twice a day">Twice a day</option>
              <option value="Three times a day">Three times a day</option>
              <option value="As needed (PRN)">As needed (PRN)</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreatePrescription} sx={{ background: 'linear-gradient(45deg, #0ea5e9, #8b5cf6)' }}>Issue Prescription</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorDashboard;