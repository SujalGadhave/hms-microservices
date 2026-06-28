import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Alert, Grid } from '@mui/material';
import InsertChartIcon from '@mui/icons-material/InsertChart';

interface ReportResponse {
  reportType: string;
  content: string;
}

const ReportingDashboard = () => {
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('/api/v1/reports/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch hospital report');
        const json = await response.json();
        setReport(json.data);
      } catch (err: any) {
        setError(err.message || 'Services might be down. Please run start-services.ps1');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Hospital Reporting</Typography>
        <Typography variant="subtitle1" sx={{ color: '#8b5cf6', fontWeight: 500 }}>
          Central Analytics & Reporting Engine
        </Typography>
      </Box>

      {error && <Alert severity="warning">{error}</Alert>}

      <Card sx={{ background: 'rgba(30,41,59,0.4)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <InsertChartIcon sx={{ fontSize: 40, color: '#8b5cf6' }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>System Summary Report</Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress sx={{ color: '#8b5cf6' }} /></Box>
          ) : report ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)' }}>
                  <CardContent>
                    <Typography sx={{ color: '#cbd5e1', mb: 1 }}>Report Type</Typography>
                    <Typography variant="h6" sx={{ color: '#8b5cf6', fontWeight: 700 }}>{report.reportType}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <CardContent>
                    <Typography sx={{ color: '#cbd5e1', mb: 2, fontWeight: 600 }}>Generated Content</Typography>
                    <Typography component="pre" sx={{ 
                      color: '#94a3b8', 
                      fontFamily: 'monospace', 
                      whiteSpace: 'pre-wrap',
                      bgcolor: 'rgba(0,0,0,0.3)',
                      p: 2,
                      borderRadius: 1
                    }}>
                      {report.content}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Typography sx={{ color: '#94a3b8' }}>No report data available.</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReportingDashboard;
