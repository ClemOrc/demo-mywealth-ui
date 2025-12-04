import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
  Chip,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { ModificationRequest, ModificationRequestStatus } from '../../../types';
import { format } from 'date-fns';

interface ModificationRequestDialogProps {
  open: boolean;
  request: ModificationRequest;
  onClose: () => void;
  onApprove: (requestId: string, comments?: string) => void;
  onReject: (requestId: string, reason: string) => void;
  approving: boolean;
  rejecting: boolean;
}

const ModificationRequestDialog: React.FC<ModificationRequestDialogProps> = ({
  open,
  request,
  onClose,
  onApprove,
  onReject,
  approving,
  rejecting,
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [approvalComments, setApprovalComments] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: ModificationRequestStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    const statusColors: Record<ModificationRequestStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      [ModificationRequestStatus.PENDING]: 'warning',
      [ModificationRequestStatus.APPROVED]: 'success',
      [ModificationRequestStatus.REJECTED]: 'error',
      [ModificationRequestStatus.CANCELLED]: 'default',
    };
    return statusColors[status];
  };

  const handleApprove = () => {
    onApprove(request.id, approvalComments);
  };

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(request.id, rejectReason);
    }
  };

  const isPending = request.status === ModificationRequestStatus.PENDING;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Modification Request Details</Typography>
          <Chip
            label={request.status}
            color={getStatusColor(request.status)}
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Request Information */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Request Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Request ID
                </Typography>
                <Typography variant="body1">{request.id}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Request Type
                </Typography>
                <Typography variant="body1">
                  {request.requestType.replace('_', ' ')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Requested By
                </Typography>
                <Typography variant="body1">{request.requestedBy}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Requested At
                </Typography>
                <Typography variant="body1">
                  {formatDate(request.requestedAt)}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Agreement Information */}
          {request.agreement && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Agreement Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Agreement Number
                  </Typography>
                  <Typography variant="body1">
                    {request.agreement.agreementNumber}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Client Name
                  </Typography>
                  <Typography variant="body1">
                    {request.agreement.clientName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Agreement Type
                  </Typography>
                  <Typography variant="body1">
                    {request.agreement.agreementType}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Current Status
                  </Typography>
                  <Chip
                    label={request.agreement.status}
                    size="small"
                    color="primary"
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Changes */}
          {request.changes && request.changes.length > 0 && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Proposed Changes
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Field</TableCell>
                      <TableCell>Current Value</TableCell>
                      <TableCell>New Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {request.changes.map((change, index) => (
                      <TableRow key={index}>
                        <TableCell>{change.field}</TableCell>
                        <TableCell>{change.oldValue}</TableCell>
                        <TableCell>
                          <Typography color="primary" fontWeight="bold">
                            {change.newValue}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Comments */}
          {request.comments && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Comments
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1">{request.comments}</Typography>
            </Box>
          )}

          {/* Approval/Rejection Details */}
          {request.status === ModificationRequestStatus.APPROVED && request.approvedBy && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Approval Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Approved By
                  </Typography>
                  <Typography variant="body1">{request.approvedBy}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Approved At
                  </Typography>
                  <Typography variant="body1">
                    {request.approvedAt && formatDate(request.approvedAt)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          {request.status === ModificationRequestStatus.REJECTED && request.rejectedBy && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Rejection Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Rejected By
                  </Typography>
                  <Typography variant="body1">{request.rejectedBy}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Rejected At
                  </Typography>
                  <Typography variant="body1">
                    {request.rejectedAt && formatDate(request.rejectedAt)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Rejection Reason
                  </Typography>
                  <Typography variant="body1">{request.rejectionReason}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Approve/Reject Form for Pending Requests */}
          {isPending && !showRejectForm && (
            <Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Approval Comments (Optional)"
                value={approvalComments}
                onChange={(e) => setApprovalComments(e.target.value)}
                placeholder="Add any comments about this approval..."
              />
            </Box>
          )}

          {isPending && showRejectForm && (
            <Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Rejection Reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a reason for rejecting this request..."
                required
                error={showRejectForm && !rejectReason.trim()}
                helperText={
                  showRejectForm && !rejectReason.trim()
                    ? 'Rejection reason is required'
                    : ''
                }
              />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        {isPending ? (
          <>
            {showRejectForm ? (
              <>
                <Button onClick={() => setShowRejectForm(false)}>Cancel</Button>
                <Button
                  onClick={handleReject}
                  color="error"
                  variant="contained"
                  disabled={rejecting || !rejectReason.trim()}
                >
                  {rejecting ? 'Rejecting...' : 'Confirm Rejection'}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={onClose}>Close</Button>
                <Button
                  onClick={() => setShowRejectForm(true)}
                  color="error"
                  variant="outlined"
                >
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  color="success"
                  variant="contained"
                  disabled={approving}
                >
                  {approving ? 'Approving...' : 'Approve'}
                </Button>
              </>
            )}
          </>
        ) : (
          <Button onClick={onClose}>Close</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ModificationRequestDialog;
