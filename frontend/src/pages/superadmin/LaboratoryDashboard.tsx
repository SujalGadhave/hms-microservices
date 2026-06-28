import { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, TextField, Dialog, 
  DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, Chip,
  InputAdornment
} from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

interface LabTest {
  id: string;
  patientId: string;
  testName: string;
  status: string;
  result: string;
}

const LaboratoryDashboard = () => {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchPatientId, setSearchPatientId] = useState('');
  
  const [open, setOpen] = useState(false);
  const [newTest, setNewTest] = useState({
    patientId: '',
    testName: ''
  });

  const handleSearch = async () => {
    if (!searchPatientId) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/v1/laboratory/tests/patient/${searchPatientId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch lab tests or patient not found');
      const json = await response.json();
      setTests(json.data || []);
    } catch (err: any) {
      setError(err.message || 'Services might be down. Please run start-services.ps1');
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderTest = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/v1/laboratory/tests', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTest)
      });
      if (!response.ok) throw new Error('Failed to order test');
      
      alert('Test ordered successfully!');
      setOpen(false);
      
      // If we are currently viewing this patient's tests, refresh the list
      if (searchPatientId === newTest.patientId) {
        handleSearch();
      }
      
      setNewTest({ patientId: '', testName: '' });
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Laboratory Service</Typography>
          <Typography variant="subtitle1" sx={{ color: '#0ea5e9', fontWeight: 500 }}>
            Central Laboratory Management System
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setOpen(true)}
          sx={{ background: 'linear-gradient(45deg, #0ea5e9, #8b5cf6)' }}
        >
          Order Lab Test
        </Button>
      </Box>

      {error && <Alert severity="warning">{error}</Alert>}

      <Card sx={{ background: 'rgba(30,41,59,0.4)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Patient Test Records</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField 
                size="small"
                placeholder="Enter Patient ID"
                value={searchPatientId}
                onChange={(e) => setSearchPatientId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    ),
                  }
                }}
              />
              <Button variant="outlined" onClick={handleSearch} sx={{ borderColor: '#0ea5e9', color: '#0ea5e9' }}>
                Search
              </Button>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress sx={{ color: '#0ea5e9' }} /></Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ borderBottom: '2px solid rgba(255,255,255,0.05)' }}>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Test ID</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Patient ID</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Test Name</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Result</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ color: '#94a3b8', py: 4 }}>
                        <ScienceIcon sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
                        <Typography>Search for a Patient ID to view their lab tests.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    tests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell sx={{ color: '#94a3b8', fontFamily: 'monospace' }}>{test.id.substring(0, 8)}</TableCell>
                        <TableCell sx={{ color: '#94a3b8', fontFamily: 'monospace' }}>{test.patientId.substring(0, 8)}</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>{test.testName}</TableCell>
                        <TableCell>
                          <Chip 
                            label={test.status || 'PENDING'} 
                            size="small"
                            sx={{ 
                              bgcolor: test.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: test.status === 'COMPLETED' ? '#34d399' : '#fbbf24',
                              fontWeight: 600
                            }} 
                          />
                        </TableCell>
                        <TableCell sx={{ color: test.result ? 'white' : '#64748b' }}>
                          {test.result || 'Awaiting Analysis'}
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

      {/* Order Test Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Order Lab Test</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField 
              label="Patient ID" 
              fullWidth 
              required
              value={newTest.patientId}
              onChange={(e) => setNewTest({ ...newTest, patientId: e.target.value })}
            />
            <TextField 
              label="Test Name" 
              fullWidth 
              required
              placeholder="e.g. Complete Blood Count (CBC)"
              value={newTest.testName}
              onChange={(e) => setNewTest({ ...newTest, testName: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button variant="contained" onClick={handleOrderTest} sx={{ background: '#0ea5e9' }}>Order Test</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LaboratoryDashboard;
