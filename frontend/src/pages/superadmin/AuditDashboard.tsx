import { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, CircularProgress, Alert, Chip,
  Pagination
} from '@mui/material';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';

interface AuditLog {
  id: string;
  serviceName: string;
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  performedBy: string;
  timestamp: string;
  details: string;
}

interface PageData {
  content: AuditLog[];
  totalPages: number;
  totalElements: number;
  number: number;
}

const AuditDashboard = () => {
  const [audits, setAudits] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAudits = async (pageNumber: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/v1/audits?page=${pageNumber - 1}&size=15`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      const data: PageData = await response.json();
      setAudits(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Services might be down. Please run start-services.ps1');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits(page);
  }, [page]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399' };
      case 'UPDATE': return { bg: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8' };
      case 'DELETE': return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' };
      case 'LOGIN': return { bg: 'rgba(139, 92, 246, 0.15)', text: '#a78bfa' };
      default: return { bg: 'rgba(255, 255, 255, 0.1)', text: '#cbd5e1' };
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>System Audit Logs</Typography>
        <Typography variant="subtitle1" sx={{ color: '#f59e0b', fontWeight: 500 }}>
          Central Audit & Compliance Tracking
        </Typography>
      </Box>

      {error && <Alert severity="warning">{error}</Alert>}

      <Card sx={{ background: 'rgba(30,41,59,0.4)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Event History</Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress sx={{ color: '#f59e0b' }} /></Box>
          ) : (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ borderBottom: '2px solid rgba(255,255,255,0.05)' }}>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Timestamp</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Service</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Action</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>User</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Entity ID</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {audits.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ color: '#94a3b8', py: 4 }}>
                          <AssuredWorkloadIcon sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
                          <Typography>No audit logs found.</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      audits.map((log) => {
                        const colors = getActionColor(log.action);
                        return (
                          <TableRow key={log.id} hover sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                            <TableCell sx={{ color: '#cbd5e1', fontSize: '0.8rem' }}>
                              {new Date(log.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>{log.serviceName}</TableCell>
                            <TableCell>
                              <Chip 
                                label={log.action} 
                                size="small"
                                sx={{ 
                                  bgcolor: colors.bg,
                                  color: colors.text,
                                  fontWeight: 700,
                                  fontSize: '0.7rem',
                                  height: 20
                                }} 
                              />
                            </TableCell>
                            <TableCell sx={{ color: 'white', fontSize: '0.85rem' }}>{log.performedBy}</TableCell>
                            <TableCell sx={{ color: '#64748b', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                              {log.entityId ? log.entityId.substring(0, 8) + '...' : '-'}
                            </TableCell>
                            <TableCell sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                              {log.details || '-'}
                            </TableCell>
                          </TableRow>
                        );
                      })
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
                    color="primary" 
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

export default AuditDashboard;
