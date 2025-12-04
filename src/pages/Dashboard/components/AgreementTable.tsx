import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  Typography,
  Box,
  CircularProgress,
  Button,
} from '@mui/material';
import { Agreement, AgreementStatus } from '../../../types';
import { format } from 'date-fns';

interface AgreementTableProps {
  agreements: Agreement[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRowClick: (agreementId: string) => void;
}

const AgreementTable: React.FC<AgreementTableProps> = ({
  agreements,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRowClick,
}) => {
  const getStatusColor = (status: AgreementStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    const statusColors: Record<AgreementStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      [AgreementStatus.ACTIVE]: 'success',
      [AgreementStatus.PENDING_APPROVAL]: 'warning',
      [AgreementStatus.DRAFT]: 'default',
      [AgreementStatus.SUSPENDED]: 'error',
      [AgreementStatus.TERMINATED]: 'error',
      [AgreementStatus.EXPIRED]: 'default',
    };
    return statusColors[status];
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPageSizeChange(parseInt(event.target.value, 10));
    onPageChange(0);
  };

  if (loading && agreements.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!loading && agreements.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No agreements found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Request Type</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Program / Subprogram</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Creation Date</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Root</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>AI Code</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Fee Group</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Created by</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Modified by</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Client Name</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agreements.map((agreement, index) => (
              <TableRow
                key={agreement.id || `agreement-${index}`}
                hover
                onClick={() => onRowClick(agreement.id)}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f9f9f9' } }}
              >
                <TableCell>
                  <Chip
                    label={agreement.status ? agreement.status.replace('_', ' ') : 'UNKNOWN'}
                    color={getStatusColor(agreement.status as AgreementStatus)}
                    size="small"
                    sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>
                  {agreement.status === AgreementStatus.PENDING_APPROVAL ? 'Setup' : '--'}
                </TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>
                  {agreement.agreementType || 'N/A'}
                </TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{formatDate(agreement.startDate)}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{agreement.agreementNumber}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{agreement.clientName || 'N/A'}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{agreement.clientRoot || 'N/A'}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{agreement.iaCode || 'N/A'}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{agreement.feeGroup || 'N/A'}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{agreement.createdBy || 'N/A'}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{agreement.modifiedBy || 'N/A'}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem' }}>{agreement.clientName || 'N/A'}</TableCell>
                <TableCell>
                  <Button size="small" sx={{ textTransform: 'none', minWidth: 'auto', p: 0.5 }}>
                    •••
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default AgreementTable;
