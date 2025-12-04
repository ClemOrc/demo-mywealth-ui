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
} from '@mui/material';
import { ModificationRequest, ModificationRequestStatus } from '../../../types';
import { format } from 'date-fns';

interface ModificationRequestsTableProps {
  requests: ModificationRequest[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRowClick: (request: ModificationRequest) => void;
}

const ModificationRequestsTable: React.FC<ModificationRequestsTableProps> = ({
  requests,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onRowClick,
}) => {
  const getStatusColor = (status: ModificationRequestStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    const statusColors: Record<ModificationRequestStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      [ModificationRequestStatus.PENDING]: 'warning',
      [ModificationRequestStatus.APPROVED]: 'success',
      [ModificationRequestStatus.REJECTED]: 'error',
      [ModificationRequestStatus.CANCELLED]: 'default',
    };
    return statusColors[status];
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
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

  if (loading && requests.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!loading && requests.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No modification requests found
        </Typography>
      </Box>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Request ID</TableCell>
              <TableCell>Agreement Number</TableCell>
              <TableCell>Request Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Requested By</TableCell>
              <TableCell>Requested At</TableCell>
              <TableCell>Client Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request, index) => (
              <TableRow
                key={request.id || `request-${index}`}
                hover
                onClick={() => onRowClick(request)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{request.id ? request.id.substring(0, 8) : 'N/A'}</TableCell>
                <TableCell>{request.agreement?.agreementNumber || 'N/A'}</TableCell>
                <TableCell>{request.requestType ? request.requestType.replace('_', ' ') : 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={request.status || 'UNKNOWN'}
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{request.requestedBy || 'N/A'}</TableCell>
                <TableCell>{request.requestedAt ? formatDate(request.requestedAt) : 'N/A'}</TableCell>
                <TableCell>{request.agreement?.clientName || 'N/A'}</TableCell>
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
    </Paper>
  );
};

export default ModificationRequestsTable;
