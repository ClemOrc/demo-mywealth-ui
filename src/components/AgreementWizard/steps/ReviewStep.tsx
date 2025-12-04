import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Alert,
} from '@mui/material';
import { Description as DescriptionIcon } from '@mui/icons-material';
import { FormikProps } from 'formik';
import type { CreateAgreementFormValues } from '../../../types';

type Props = FormikProps<CreateAgreementFormValues>;

const ReviewStep: React.FC<Props> = ({ values }) => {
  // All data is already available in form values - no need for GraphQL queries

  return (
    <Box>
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Note that your request won't be sent until you click on "Submit Agreement" at the bottom of the screen.
        </Typography>
      </Alert>

      {/* Client Details */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Client Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {values.clientName ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">Client Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{values.clientName}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Client ID</Typography>
                <Typography variant="body1">{values.clientId}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">Agreement Type</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{values.agreementType || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Start Date</Typography>
                <Typography variant="body1">{values.startDate || 'N/A'}</Typography>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography color="text.secondary">No client selected</Typography>
        )}
      </Paper>

      {/* Investing Account */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Investing Account
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {values.selectedAccounts && values.selectedAccounts.length > 0 ? (
          <Box sx={{ p: 2, bgcolor: '#f5f9ff', borderRadius: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {values.selectedAccounts.length} account{values.selectedAccounts.length > 1 ? 's' : ''} selected
            </Typography>
            <Typography variant="body2" color="text.secondary">Account IDs: {values.selectedAccounts.join(', ')}</Typography>
          </Box>
        ) : (
          <Typography color="text.secondary">No accounts selected</Typography>
        )}
      </Paper>

      {/* Asset Allocation Policies */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Asset Allocation Policies
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {values.selectedPolicyId ? (
          <Box sx={{ p: 2, bgcolor: '#f5f9ff', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">Selected Policy ID</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>{values.selectedPolicyId}</Typography>
          </Box>
        ) : (
          <Typography color="text.secondary">No policy selected</Typography>
        )}
      </Paper>

      {/* Billing Details */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Billing Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="caption" color="text.secondary">Frequency</Typography>
            <Typography variant="body1">{values.billingFrequency || 'Not specified'}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="caption" color="text.secondary">Billing Account</Typography>
            <Typography variant="body1">{values.billingAccount === 'individual' ? 'Bill all accounts individually' : 'Bill all accounts together'}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="caption" color="text.secondary">Start Date</Typography>
            <Typography variant="body1">{values.billingStartDate || 'Not specified'}</Typography>
          </Grid>
        </Grid>

        {values.selectedHouseholdMembers && values.selectedHouseholdMembers.length > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f9ff', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Household Billing</Typography>
            <Typography variant="body2">{values.selectedHouseholdMembers.length} household member{values.selectedHouseholdMembers.length > 1 ? 's' : ''} included</Typography>
          </Box>
        )}
      </Paper>

      {/* Program Fees */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Program Fees
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {values.programType ? (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">Program Type</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{values.programType}</Typography>
                </Box>
                {values.feeType && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Fee Type</Typography>
                    <Typography variant="body1">{values.feeType}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {values.currentFeeAccount && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">Current Fee Account</Typography>
                    <Typography variant="body1">{values.currentFeeAccount === 'yes' ? 'Yes' : 'No'}</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </>
        ) : (
          <Typography color="text.secondary">No program fee selected</Typography>
        )}
      </Paper>

      {/* Attachments */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Attachments
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {values.documents && values.documents.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {values.documents.map((file, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DescriptionIcon sx={{ color: 'text.secondary' }} />
                <Typography variant="body2">{file.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {(file.size / 1024).toFixed(2)} KB
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary">No documents attached</Typography>
        )}
      </Paper>

      {/* Notes */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Notes
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {values.comments ? (
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2">{values.comments}</Typography>
          </Box>
        ) : (
          <Typography color="text.secondary">No notes added</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ReviewStep;
