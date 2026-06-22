import { Typography, Grid, Card, CardContent, Box, Button } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useNavigate } from 'react-router-dom';

const stats = [
  { title: 'Total Patients', value: '12,450', diff: '+2.5% this week', icon: <PeopleIcon sx={{ fontSize: 32, color: '#0ea5e9' }} />, color: '#0ea5e9' },
  { title: 'Active Doctors', value: '450', diff: '98% on duty', icon: <LocalHospitalIcon sx={{ fontSize: 32, color: '#8b5cf6' }} />, color: '#8b5cf6' },
  { title: 'Today Appointments', value: '320', diff: '+12.4% vs yesterday', icon: <AssessmentIcon sx={{ fontSize: 32, color: '#10b981' }} />, color: '#10b981' },
];

const recentActivity = [
  { time: '10 mins ago', type: 'Registration', desc: 'New Patient "David Miller" registered', role: 'admin' },
  { time: '25 mins ago', type: 'Appointment', desc: 'Appointment APT002 confirmed for Jane Smith', role: 'scheduler' },
  { time: '1 hour ago', type: 'Billing', desc: 'Invoice generated for Patient "Emily Davis"', role: 'billing' },
  { time: '2 hours ago', type: 'Clinical', desc: 'Prescription written by Dr. Gregory House', role: 'doctor' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Hospital Overview</Typography>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={4}>
        {stats.map((stat, i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <Card sx={{ background: 'rgba(30, 41, 59, 0.4)' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 4 }}>
                <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>{stat.title}</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>{stat.value}</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUpIcon sx={{ fontSize: 16, color: '#10b981' }} />
                    <span style={{ color: '#10b981', fontWeight: 600 }}>{stat.diff.split(' ')[0]}</span>
                    {stat.diff.substring(stat.diff.indexOf(' '))}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Grid: Charts & Activity */}
      <Grid container spacing={4}>
        {/* SVG Area Chart */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ background: 'rgba(30, 41, 59, 0.4)', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Patient Admission Flow</Typography>
              <Box sx={{ width: '100%', height: 220 }}>
                <svg viewBox="0 0 500 220" width="100%" height="100%">
                  <defs>
                    <linearGradient id="dashboardAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  <line x1="30" y1="30" x2="480" y2="30" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
                  <line x1="30" y1="90" x2="480" y2="90" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
                  <line x1="30" y1="150" x2="480" y2="150" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
                  <line x1="30" y1="190" x2="480" y2="190" stroke="rgba(255,255,255,0.1)" />

                  <path d="M 30 190 L 30 120 Q 120 140 180 80 T 320 100 T 420 50 T 480 40 L 480 190 Z" fill="url(#dashboardAreaGrad)" />
                  <path d="M 30 120 Q 120 140 180 80 T 320 100 T 420 50 T 480 40" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />

                  <circle cx="30" cy="120" r="4" fill="#8b5cf6" stroke="white" strokeWidth="1.5" />
                  <circle cx="180" cy="80" r="4" fill="#8b5cf6" stroke="white" strokeWidth="1.5" />
                  <circle cx="320" cy="100" r="4" fill="#8b5cf6" stroke="white" strokeWidth="1.5" />
                  <circle cx="480" cy="40" r="4" fill="#8b5cf6" stroke="white" strokeWidth="1.5" />

                  <text x="30" y="210" fill="#64748b" fontSize="10" textAnchor="middle">Mon</text>
                  <text x="180" y="210" fill="#64748b" fontSize="10" textAnchor="middle">Wed</text>
                  <text x="320" y="210" fill="#64748b" fontSize="10" textAnchor="middle">Fri</text>
                  <text x="480" y="210" fill="#64748b" fontSize="10" textAnchor="middle">Sun</text>
                </svg>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Audit / Events */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ background: 'rgba(30, 41, 59, 0.4)', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Recent Activity Feed</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {recentActivity.map((activity, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ minWidth: 70 }}>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>{activity.time}</Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{activity.desc}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'capitalize' }}>
                        Performed by: <strong>{activity.role}</strong>
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Action Buttons */}
      <Card sx={{ background: 'rgba(30, 41, 59, 0.4)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Quick Portal Actions</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" onClick={() => navigate('/admin/patients')} sx={{ background: 'linear-gradient(45deg, #0ea5e9, #0284c7)' }}>
              Manage Patients List
            </Button>
            <Button variant="contained" onClick={() => navigate('/admin/appointments')} sx={{ background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)' }}>
              View Scheduled Appointments
            </Button>
            <Button variant="contained" onClick={() => navigate('/admin/analytics')} sx={{ background: 'linear-gradient(45deg, #10b981, #059669)' }}>
              Inspect Analytics Reports
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;