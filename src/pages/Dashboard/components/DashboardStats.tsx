import React from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import {
  TrendingUp,
  CheckCircle,
  HourglassEmpty,
  Warning,
} from '@mui/icons-material';

interface DashboardStatsData {
  totalAgreements: number;
  activeAgreements: number;
  pendingApprovals: number;
  expiringSoon: number;
  totalValue: number;
}

interface DashboardStatsProps {
  data?: DashboardStatsData;
  loading: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const stats = [
    {
      title: 'Total Agreements',
      value: data?.totalAgreements || 0,
      icon: <TrendingUp fontSize="large" color="primary" />,
      color: 'primary.main',
    },
    {
      title: 'Active Agreements',
      value: data?.activeAgreements || 0,
      icon: <CheckCircle fontSize="large" color="success" />,
      color: 'success.main',
    },
    {
      title: 'Pending Approvals',
      value: data?.pendingApprovals || 0,
      icon: <HourglassEmpty fontSize="large" color="warning" />,
      color: 'warning.main',
    },
    {
      title: 'Expiring Soon',
      value: data?.expiringSoon || 0,
      icon: <Warning fontSize="large" color="error" />,
      color: 'error.main',
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {stat.icon}
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ ml: 2, color: stat.color }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {data?.totalValue && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Portfolio Value
            </Typography>
            <Typography variant="h3" color="primary">
              {formatCurrency(data.totalValue)}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DashboardStats;
