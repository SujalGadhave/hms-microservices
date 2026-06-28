import { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, TextField, Dialog, 
  DialogTitle, DialogContent, DialogActions, CircularProgress, Alert
} from '@mui/material';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import AddIcon from '@mui/icons-material/Add';
import ScienceIcon from '@mui/icons-material/Science';

interface Medicine {
  id: string;
  name: string;
  manufacturer: string;
  unitPrice: number;
  stockQuantity: number;
}

const PharmacyDashboard = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    manufacturer: '',
    unitPrice: 0,
    stockQuantity: 0
  });

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/v1/medicines', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch medicines');
      const json = await response.json();
      setMedicines(json.data || []);
    } catch (err: any) {
      setError(err.message || 'Services might be down. Please run start-services.ps1');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleAddMedicine = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/v1/medicines', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMedicine)
      });
      if (!response.ok) throw new Error('Failed to add medicine');
      setOpen(false);
      setNewMedicine({ name: '', manufacturer: '', unitPrice: 0, stockQuantity: 0 });
      fetchMedicines();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Pharmacy Service</Typography>
          <Typography variant="subtitle1" sx={{ color: '#10b981', fontWeight: 500 }}>
            Central Pharmacy & Inventory Management
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setOpen(true)}
          sx={{ background: 'linear-gradient(45deg, #10b981, #3b82f6)' }}
        >
          Add Medicine
        </Button>
      </Box>

      {error && <Alert severity="warning">{error}</Alert>}

      <Card sx={{ background: 'rgba(30,41,59,0.4)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Inventory</Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress sx={{ color: '#10b981' }} /></Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ borderBottom: '2px solid rgba(255,255,255,0.05)' }}>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Medicine Name</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Manufacturer</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Unit Price</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Stock Quantity</TableCell>
                    <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medicines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ color: '#94a3b8', py: 4 }}>
                        <LocalPharmacyIcon sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
                        <Typography>No medicines found in inventory.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    medicines.map((med) => (
                      <TableRow key={med.id}>
                        <TableCell sx={{ color: 'white', fontWeight: 600 }}>{med.name}</TableCell>
                        <TableCell sx={{ color: '#94a3b8' }}>{med.manufacturer}</TableCell>
                        <TableCell sx={{ color: '#94a3b8' }}>${med.unitPrice.toFixed(2)}</TableCell>
                        <TableCell sx={{ color: 'white' }}>{med.stockQuantity}</TableCell>
                        <TableCell>
                          {med.stockQuantity > 20 ? (
                            <Typography sx={{ color: '#34d399', fontSize: '0.875rem' }}>In Stock</Typography>
                          ) : (
                            <Typography sx={{ color: '#fbbf24', fontSize: '0.875rem' }}>Low Stock</Typography>
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

      {/* Add Medicine Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Medicine</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField 
              label="Medicine Name" 
              fullWidth 
              value={newMedicine.name}
              onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
            />
            <TextField 
              label="Manufacturer" 
              fullWidth 
              value={newMedicine.manufacturer}
              onChange={(e) => setNewMedicine({ ...newMedicine, manufacturer: e.target.value })}
            />
            <TextField 
              label="Unit Price ($)" 
              type="number"
              fullWidth 
              value={newMedicine.unitPrice}
              onChange={(e) => setNewMedicine({ ...newMedicine, unitPrice: parseFloat(e.target.value) })}
            />
            <TextField 
              label="Stock Quantity" 
              type="number"
              fullWidth 
              value={newMedicine.stockQuantity}
              onChange={(e) => setNewMedicine({ ...newMedicine, stockQuantity: parseInt(e.target.value) })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddMedicine} sx={{ background: '#10b981' }}>Add to Inventory</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PharmacyDashboard;
