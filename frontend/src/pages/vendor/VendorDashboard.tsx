import { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
}

const initialInventory: InventoryItem[] = [
  { id: '1', name: 'Surgical Gloves (L)', category: 'PPE',         quantity: 850, unit: 'pairs', reorderLevel: 200, status: 'In Stock',    lastUpdated: '2026-06-25' },
  { id: '2', name: 'Saline Solution 0.9%', category: 'IV Fluids', quantity: 45,  unit: 'bags',  reorderLevel: 100, status: 'Low Stock',   lastUpdated: '2026-06-26' },
  { id: '3', name: 'Disposable Syringes', category: 'Supplies',   quantity: 0,   unit: 'pcs',   reorderLevel: 500, status: 'Out of Stock', lastUpdated: '2026-06-20' },
  { id: '4', name: 'N95 Masks',           category: 'PPE',         quantity: 320, unit: 'pcs',   reorderLevel: 100, status: 'In Stock',    lastUpdated: '2026-06-27' },
  { id: '5', name: 'Paracetamol 500mg',   category: 'Medications', quantity: 78,  unit: 'packs', reorderLevel: 150, status: 'Low Stock',   lastUpdated: '2026-06-25' },
];

const VendorDashboard = () => {
  const firstName   = localStorage.getItem('userFirstName') ?? '';
  const lastName    = localStorage.getItem('userLastName') ?? '';
  const userEmail   = localStorage.getItem('userEmail') ?? '';
  const displayName = firstName ? `${firstName} ${lastName}`.trim() : userEmail.split('@')[0];

  const [inventory, setInventory]   = useState<InventoryItem[]>(initialInventory);
  const [orderOpen, setOrderOpen]   = useState(false);
  const [orderTarget, setOrderTarget] = useState<InventoryItem | null>(null);
  const [orderQty, setOrderQty]     = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const lowCount  = inventory.filter(i => i.status === 'Low Stock').length;
  const outCount  = inventory.filter(i => i.status === 'Out of Stock').length;
  const okCount   = inventory.filter(i => i.status === 'In Stock').length;

  const handlePlaceOrder = () => {
    if (!orderTarget || !orderQty || parseInt(orderQty) <= 0) return;
    setInventory(prev => prev.map(i => {
      if (i.id !== orderTarget.id) return i;
      const newQty = i.quantity + parseInt(orderQty);
      return {
        ...i,
        quantity: newQty,
        status: newQty >= i.reorderLevel ? 'In Stock' : newQty > 0 ? 'Low Stock' : 'Out of Stock',
        lastUpdated: new Date().toISOString().split('T')[0]
      };
    }));
    setSuccessMsg(`Order of ${orderQty} ${orderTarget.unit} of "${orderTarget.name}" placed successfully`);
    setTimeout(() => setSuccessMsg(''), 4000);
    setOrderOpen(false);
    setOrderQty('');
    setOrderTarget(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Welcome, {displayName}</Typography>
          <Typography variant="subtitle1" sx={{ color: '#f59e0b', fontWeight: 500 }}>Vendor Portal — Supply Management</Typography>
        </Box>
      </Box>

      {successMsg && <Alert severity="success" icon={<TaskAltIcon />}>{successMsg}</Alert>}

      {/* Stats */}
      <Grid container spacing={3}>
        {[
          { label: 'Items In Stock',    value: okCount,  icon: <InventoryIcon sx={{ fontSize: 32, color: '#10b981' }} />,       bg: 'rgba(16,185,129,0.1)' },
          { label: 'Low Stock Items',   value: lowCount, icon: <WarningAmberIcon sx={{ fontSize: 32, color: '#f59e0b' }} />,    bg: 'rgba(245,158,11,0.1)' },
          { label: 'Out of Stock',      value: outCount, icon: <LocalShippingIcon sx={{ fontSize: 32, color: '#ef4444' }} />,   bg: 'rgba(239,68,68,0.1)' },
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

      {/* Inventory table */}
      <Card sx={{ background: 'rgba(30,41,59,0.4)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Hospital Inventory Tracker</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ borderBottom: '2px solid rgba(255,255,255,0.05)' }}>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Item Name</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Quantity</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Reorder Level</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Last Updated</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' }, background: item.status === 'Out of Stock' ? 'rgba(239,68,68,0.03)' : 'transparent' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>{item.name}</TableCell>
                    <TableCell sx={{ color: '#94a3b8' }}>{item.category}</TableCell>
                    <TableCell sx={{ color: item.quantity === 0 ? '#ef4444' : item.quantity < item.reorderLevel ? '#f59e0b' : '#10b981', fontWeight: 700 }}>
                      {item.quantity} {item.unit}
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{item.reorderLevel} {item.unit}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{item.lastUpdated}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          bgcolor: item.status === 'In Stock' ? 'rgba(16,185,129,0.15)' : item.status === 'Low Stock' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                          color:   item.status === 'In Stock' ? '#34d399'               : item.status === 'Low Stock' ? '#fbbf24'               : '#f87171',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<LocalShippingIcon />}
                        onClick={() => { setOrderTarget(item); setOrderOpen(true); setOrderQty(''); }}
                        sx={{ background: 'linear-gradient(90deg, #f59e0b, #ef4444)', fontSize: '0.75rem' }}
                      >
                        Reorder
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Reorder Dialog */}
      <Dialog open={orderOpen} onClose={() => setOrderOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Place Reorder — {orderTarget?.name}</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
            Current stock: <strong style={{ color: 'white' }}>{orderTarget?.quantity} {orderTarget?.unit}</strong>
          </Typography>
          <TextField
            label={`Quantity to order (${orderTarget?.unit})`}
            type="number"
            fullWidth
            value={orderQty}
            onChange={(e) => setOrderQty(e.target.value)}
            slotProps={{ htmlInput: { min: 1 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOrderOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button variant="contained" onClick={handlePlaceOrder} sx={{ background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }}>
            Place Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorDashboard;
