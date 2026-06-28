import { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, CircularProgress, Alert, Chip,
  Pagination
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';

interface Invoice {
  id: string;
  consultationFee: number;
  tax: number;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
}

interface PageData {
  content: Invoice[];
  totalPages: number;
  totalElements: number;
  number: number;
}

const BillingDashboard = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInvoices = async (pageNumber: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      // Spring Data pages are 0-indexed, so subtract 1
      const response = await fetch(`/api/v1/invoices?page=${pageNumber - 1}&size=10`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch invoices');
      const data: PageData = await response.json();
      setInvoices(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Services might be down. Please run start-services.ps1');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(page);
  }, [page]);

  const handlePay = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/v1/invoices/${id}/pay`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to process payment');
      
      alert('Payment processed successfully!');
      fetchInvoices(page); // refresh list
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Billing & Finance</Typography>
        <Typography variant="subtitle1" sx={{ color: '#ec4899', fontWeight: 500 }}>
          Central Billing & Payment Management
        </Typography>
      </Box>

      {error && <Alert severity="warning">{error}</Alert>}

      <Card sx={{ background: 'rgba(30,41,59,0.4)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Recent Invoices</Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress sx={{ color: '#ec4899' }} /></Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ borderBottom: '2px solid rgba(255,255,255,0.05)' }}>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Invoice ID</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Consultation Fee</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Tax</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Total Amount</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ color: '#94a3b8', py: 4 }}>
                          <ReceiptIcon sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
                          <Typography>No invoices found.</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      invoices.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell sx={{ color: '#94a3b8', fontFamily: 'monospace' }}>{inv.id.substring(0, 8)}</TableCell>
                          <TableCell sx={{ color: '#94a3b8' }}>${inv.consultationFee?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell sx={{ color: '#94a3b8' }}>${inv.tax?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>${inv.totalAmount?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell>
                            <Chip 
                              label={inv.status} 
                              size="small"
                              sx={{ 
                                bgcolor: inv.status === 'PAID' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                color: inv.status === 'PAID' ? '#34d399' : '#fbbf24',
                                fontWeight: 600
                              }} 
                            />
                          </TableCell>
                          <TableCell align="right">
                            {inv.status === 'PENDING' ? (
                              <Button 
                                variant="contained" 
                                size="small" 
                                startIcon={<PaymentIcon />}
                                onClick={() => handlePay(inv.id)}
                                sx={{ bgcolor: '#ec4899', '&:hover': { bgcolor: '#be185d' } }}
                              >
                                Pay Now
                              </Button>
                            ) : (
                              <Button 
                                variant="outlined" 
                                size="small" 
                                href={`/api/v1/invoices/${inv.id}/pdf`}
                                target="_blank"
                                sx={{ borderColor: '#ec4899', color: '#ec4899' }}
                              >
                                Download PDF
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={(_, value) => setPage(value)} 
                    color="secondary" 
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BillingDashboard;
