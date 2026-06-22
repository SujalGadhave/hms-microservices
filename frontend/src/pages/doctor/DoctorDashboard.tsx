import { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CreateIcon from '@mui/icons-material/Create';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GroupIcon from '@mui/icons-material/Group';

interface AppointmentQueue {
  id: string;
  patientName: string;
  age: number;
  reason: string;
  time: string;
  status: 'In Queue' | 'In Progress' | 'Completed';
}

const initialQueue: AppointmentQueue[] = [
  { id: '1', patientName: 'John Doe', age: 45, reason: 'Follow-up Checkup', time: '10:00 AM', status: 'In Queue' },
  { id: '2', patientName: 'Jane Smith', age: 34, reason: 'Migraine Review', time: '11:30 AM', status: 'In Progress' },
  { id: '3', patientName: 'Robert Johnson', age: 62, reason: 'High Blood Pressure', time: '02:00 PM', status: 'In Queue' },
  { id: '4', patientName: 'Emily Davis', age: 29, reason: 'Child Care Consult', time: '04:15 PM', status: 'Completed' },
];

const DoctorDashboard = () => {
  const [queue, setQueue] = useState<AppointmentQueue[]>(initialQueue);
  const [open, setOpen] = useState(false);
  const [prescription, setPrescription] = useState({
    patientName: '',
    medicine: '',
    dosage: '',
    frequency: 'Once a day'
  });

  const handleCreatePrescription = () => {
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

  const handleUpdateStatus = (id: string, status: 'In Queue' | 'In Progress' | 'Completed') => {
    setQueue(queue.map(q => q.id === id ? { ...q, status } : q));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Dr. Stephen Strange</Typography>
          <Typography variant="subtitle1" sx={{ color: '#0ea5e9', fontWeight: 500 }}>Chief of Surgery & Neurology</Typography>
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

      {/* Stats row */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
              <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(14, 165, 233, 0.1)' }}>
                <EventAvailableIcon sx={{ fontSize: 32, color: '#0ea5e9' }} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Queue Status</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>4 Patients</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
              <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(139, 92, 246, 0.1)' }}>
                <GroupIcon sx={{ fontSize: 32, color: '#8b5cf6' }} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Consultations Today</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>18 Visits</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
              <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)' }}>
                <LocalHospitalIcon sx={{ fontSize: 32, color: '#10b981' }} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Active Prescriptions</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>9 Written</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Appointment queue table */}
      <Card sx={{ background: 'rgba(30, 41, 59, 0.4)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Today's Patient Queue</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ borderBottom: '2px solid rgba(255,255,255,0.05)' }}>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Patient</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Age</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Reason for Visit</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Scheduled Time</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queue.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>{q.patientName}</TableCell>
                    <TableCell sx={{ color: '#94a3b8' }}>{q.age}</TableCell>
                    <TableCell sx={{ color: '#94a3b8' }}>{q.reason}</TableCell>
                    <TableCell sx={{ color: '#94a3b8' }}>{q.time}</TableCell>
                    <TableCell>
                      <Chip 
                        label={q.status} 
                        size="small"
                        sx={{ 
                          bgcolor: q.status === 'Completed' ? 'rgba(16, 185, 129, 0.15)' : q.status === 'In Progress' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(14, 165, 233, 0.15)',
                          color: q.status === 'Completed' ? '#34d399' : q.status === 'In Progress' ? '#fbbf24' : '#38bdf8',
                          fontWeight: 600
                        }} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      {q.status === 'In Queue' && (
                        <Button variant="outlined" size="small" onClick={() => handleUpdateStatus(q.id, 'In Progress')}>
                          Start Consult
                        </Button>
                      )}
                      {q.status === 'In Progress' && (
                        <Button variant="contained" color="success" size="small" onClick={() => handleUpdateStatus(q.id, 'Completed')}>
                          Complete
                        </Button>
                      )}
                      {q.status === 'Completed' && (
                        <Typography variant="body2" sx={{ color: '#64748b' }}>Finished</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
              slotProps={{ select: { native: true } }}
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