import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DownloadIcon from '@mui/icons-material/Download';

const AdminAnalytics = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Analytics & Insights</Typography>
        <Button 
          variant="outlined" 
          startIcon={<DownloadIcon />}
          sx={{ borderColor: 'rgba(255,255,255,0.15)', color: 'white' }}
        >
          Download PDF Report
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Area/Line Chart - Monthly Registrations */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ background: 'rgba(30, 41, 59, 0.4)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Patient Registration Trends</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>Monthly registrations for current year</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#10b981' }}>
                  <TrendingUpIcon />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>+12.4% vs Last Month</Typography>
                </Box>
              </Box>
              
              {/* Pure SVG Area Chart */}
              <Box sx={{ width: '100%', height: 280, position: 'relative' }}>
                <svg viewBox="0 0 800 280" width="100%" height="100%">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="50" y1="50" x2="750" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="5 5" />
                  <line x1="50" y1="120" x2="750" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="5 5" />
                  <line x1="50" y1="190" x2="750" y2="190" stroke="rgba(255,255,255,0.05)" strokeDasharray="5 5" />
                  <line x1="50" y1="250" x2="750" y2="250" stroke="rgba(255,255,255,0.1)" />

                  {/* Area */}
                  <path 
                    d="M 50 250 L 50 190 Q 150 150 200 130 T 350 120 T 500 80 T 650 90 T 750 40 L 750 250 Z" 
                    fill="url(#areaGradient)" 
                  />

                  {/* Trend Line */}
                  <path 
                    d="M 50 190 Q 150 150 200 130 T 350 120 T 500 80 T 650 90 T 750 40" 
                    fill="none" 
                    stroke="url(#lineGradient)" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                  />

                  {/* Data Points */}
                  <circle cx="50" cy="190" r="5" fill="#0ea5e9" stroke="white" strokeWidth="2" />
                  <circle cx="200" cy="130" r="5" fill="#0ea5e9" stroke="white" strokeWidth="2" />
                  <circle cx="350" cy="120" r="5" fill="#38bdf8" stroke="white" strokeWidth="2" />
                  <circle cx="500" cy="80" r="5" fill="#8b5cf6" stroke="white" strokeWidth="2" />
                  <circle cx="650" cy="90" r="5" fill="#8b5cf6" stroke="white" strokeWidth="2" />
                  <circle cx="750" cy="40" r="5" fill="#a78bfa" stroke="white" strokeWidth="2" />

                  {/* Labels */}
                  <text x="50" y="270" fill="#64748b" fontSize="12" textAnchor="middle">Jan</text>
                  <text x="200" y="270" fill="#64748b" fontSize="12" textAnchor="middle">Mar</text>
                  <text x="350" y="270" fill="#64748b" fontSize="12" textAnchor="middle">May</text>
                  <text x="500" y="270" fill="#64748b" fontSize="12" textAnchor="middle">Jul</text>
                  <text x="650" y="270" fill="#64748b" fontSize="12" textAnchor="middle">Sep</text>
                  <text x="750" y="270" fill="#64748b" fontSize="12" textAnchor="middle">Nov</text>
                  
                  <text x="40" y="55" fill="#64748b" fontSize="12" textAnchor="end">1,000</text>
                  <text x="40" y="125" fill="#64748b" fontSize="12" textAnchor="end">500</text>
                  <text x="40" y="195" fill="#64748b" fontSize="12" textAnchor="end">200</text>
                </svg>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Circular Occupancy Rate Chart */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ background: 'rgba(30, 41, 59, 0.4)', height: '100%' }}>
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Bed Occupancy</Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Current hospital capacity status</Typography>
              </Box>

              {/* Pure SVG Doughnut Chart */}
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4, position: 'relative' }}>
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
                  <circle 
                    cx="100" 
                    cy="100" 
                    r="70" 
                    fill="none" 
                    stroke="url(#lineGradient)" 
                    strokeWidth="20" 
                    strokeDasharray="440" 
                    strokeDashoffset="96" // ~78% occupancy
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                  />
                  <text x="100" y="98" fill="white" fontSize="28" fontWeight="bold" textAnchor="middle">78%</text>
                  <text x="100" y="120" fill="#64748b" fontSize="12" textAnchor="middle">Occupied</text>
                </svg>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#0ea5e9' }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>312 Beds</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Admitted</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>88 Beds</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Available</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart - Department Workload */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ background: 'rgba(30, 41, 59, 0.4)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Department Workload Index</Typography>
              
              {/* Pure SVG Bar Chart */}
              <Box sx={{ width: '100%', height: 200 }}>
                <svg viewBox="0 0 1000 200" width="100%" height="100%">
                  <line x1="80" y1="170" x2="950" y2="170" stroke="rgba(255,255,255,0.1)" />
                  
                  {/* Cardiology Bar */}
                  <rect x="120" y="60" width="60" height="110" rx="6" fill="#0ea5e9" />
                  <text x="150" y="50" fill="white" fontSize="12" fontWeight="600" textAnchor="middle">110 Patients</text>
                  <text x="150" y="190" fill="#64748b" fontSize="12" textAnchor="middle">Cardiology</text>

                  {/* Neurology Bar */}
                  <rect x="320" y="90" width="60" height="80" rx="6" fill="#8b5cf6" />
                  <text x="350" y="80" fill="white" fontSize="12" fontWeight="600" textAnchor="middle">80 Patients</text>
                  <text x="350" y="190" fill="#64748b" fontSize="12" textAnchor="middle">Neurology</text>

                  {/* Pediatrics Bar */}
                  <rect x="520" y="40" width="60" height="130" rx="6" fill="#10b981" />
                  <text x="550" y="30" fill="white" fontSize="12" fontWeight="600" textAnchor="middle">130 Patients</text>
                  <text x="550" y="190" fill="#64748b" fontSize="12" textAnchor="middle">Pediatrics</text>

                  {/* General Medicine Bar */}
                  <rect x="720" y="20" width="60" height="150" rx="6" fill="#fbbf24" />
                  <text x="750" y="10" fill="white" fontSize="12" fontWeight="600" textAnchor="middle">150 Patients</text>
                  <text x="750" y="190" fill="#64748b" fontSize="12" textAnchor="middle">General Medicine</text>
                </svg>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminAnalytics;
