import { useState, useMemo } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  status: 'Active' | 'Discharged' | 'Admitted';
  room: string;
}

const initialPatients: Patient[] = [
  { id: '1', name: 'John Doe', age: 45, gender: 'Male', phone: '+1 555-0199', email: 'john.doe@example.com', status: 'Admitted', room: 'Room 304' },
  { id: '2', name: 'Jane Smith', age: 34, gender: 'Female', phone: '+1 555-0143', email: 'jane.smith@example.com', status: 'Active', room: 'OPD' },
  { id: '3', name: 'Robert Johnson', age: 62, gender: 'Male', phone: '+1 555-0182', email: 'robert.j@example.com', status: 'Discharged', room: 'N/A' },
  { id: '4', name: 'Emily Davis', age: 29, gender: 'Female', phone: '+1 555-0125', email: 'emily.d@example.com', status: 'Admitted', room: 'ICU 102' },
  { id: '5', name: 'Michael Wilson', age: 50, gender: 'Male', phone: '+1 555-0177', email: 'michael.w@example.com', status: 'Active', room: 'OPD' },
];

const AdminPatients = () => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    status: 'Active' as Patient['status'],
    room: 'OPD'
  });

  const filteredPatients = useMemo(() =>
    patients.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
    ),
    [patients, search]
  );

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.email) return;
    const patient: Patient = {
      id: crypto.randomUUID(),
      name: newPatient.name,
      age: parseInt(newPatient.age) || 30,
      gender: newPatient.gender,
      phone: newPatient.phone || '+1 555-0000',
      email: newPatient.email,
      status: newPatient.status,
      room: newPatient.room
    };
    setPatients([...patients, patient]);
    setOpen(false);
    setNewPatient({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      email: '',
      status: 'Active',
      room: 'OPD'
    });
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteConfirmId) return;
    try {
      // Simulate API call for now, but in a real app:
      // await fetch(`/api/v1/patients/${deleteConfirmId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } });
      setPatients(prev => prev.filter(p => p.id !== deleteConfirmId));
    } catch {
      console.error('Failed to delete patient');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleEditPatient = (patient: Patient) => {
    // Logic to open edit dialog with patient details
    console.log('Editing patient', patient);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Patients Database</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setOpen(true)}
          sx={{ background: 'linear-gradient(45deg, #0ea5e9, #8b5cf6)' }}
        >
          Add Patient
        </Button>
      </Box>

      <Card sx={{ background: 'rgba(30, 41, 59, 0.4)' }}>
        <CardContent sx={{ p: 3 }}>
          <TextField
            placeholder="Search patients by name or email..."
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
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Age/Gender</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Contact Info</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Ward/Room</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>{patient.name}</TableCell>
                    <TableCell sx={{ color: '#94a3b8' }}>{patient.age} / {patient.gender}</TableCell>
                    <TableCell sx={{ color: '#94a3b8' }}>
                      <Typography variant="body2">{patient.phone}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>{patient.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={patient.status} 
                        size="small"
                        sx={{ 
                          bgcolor: patient.status === 'Admitted' ? 'rgba(139, 92, 246, 0.15)' : patient.status === 'Active' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: patient.status === 'Admitted' ? '#a78bfa' : patient.status === 'Active' ? '#38bdf8' : '#34d399',
                          fontWeight: 600
                        }} 
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#94a3b8' }}>{patient.room}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" aria-label={`Edit patient ${patient.name}`} sx={{ color: '#94a3b8', mr: 1 }} onClick={() => handleEditPatient(patient)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" aria-label={`Delete patient ${patient.name}`} sx={{ color: '#ef4444' }} onClick={() => handleDeleteClick(patient.id)}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Register New Patient</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField 
                label="Full Name" 
                fullWidth 
                required 
                value={newPatient.name} 
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })} 
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField 
                label="Age" 
                type="number" 
                fullWidth 
                value={newPatient.age} 
                slotProps={{ htmlInput: { min: 0, max: 150, 'aria-label': 'Patient age' } }}
                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })} 
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField 
                label="Gender" 
                select 
                fullWidth 
                value={newPatient.gender}
                slotProps={{ select: { native: true } }}
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField 
                label="Email Address" 
                type="email" 
                fullWidth 
                required 
                value={newPatient.email} 
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })} 
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField 
                label="Phone Number" 
                fullWidth 
                value={newPatient.phone} 
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })} 
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField 
                label="Status" 
                select 
                fullWidth 
                value={newPatient.status}
                slotProps={{ select: { native: true } }}
                onChange={(e) => setNewPatient({ ...newPatient, status: e.target.value as Patient['status'] })}
              >
                <option value="Active">Active</option>
                <option value="Admitted">Admitted</option>
                <option value="Discharged">Discharged</option>
              </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField 
                label="Ward/Room" 
                fullWidth 
                value={newPatient.room} 
                onChange={(e) => setNewPatient({ ...newPatient, room: e.target.value })} 
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddPatient} sx={{ background: 'linear-gradient(45deg, #0ea5e9, #8b5cf6)' }}>Add Patient</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Deletion</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography>Are you sure you want to delete this patient record? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDeleteConfirmId(null)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button variant="contained" onClick={handleDeleteConfirmed} sx={{ background: '#ef4444', '&:hover': { background: '#dc2626' } }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPatients;
