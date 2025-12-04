import React from 'react';
import { useQuery } from '@apollo/client';
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { FormikProps } from 'formik';
import { CreateAgreementFormValues } from '../../../types';
import { GET_ASSET_ALLOCATION_POLICIES } from '@graphql/queries';

type Props = FormikProps<CreateAgreementFormValues>;

const AssetAllocationStep: React.FC<Props> = ({ values, setFieldValue }) => {
  const [rawPolicies, setRawPolicies] = React.useState<any>(null);

  const { data, loading, error } = useQuery(GET_ASSET_ALLOCATION_POLICIES, {
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (!loading) {
      import('../../../mocks/mockStore').then(({ getMockAssetAllocationPolicies }) => {
        const mockData = getMockAssetAllocationPolicies();
        if (mockData) {
          setRawPolicies(mockData);
        }
      });
    }
  }, [loading]);

  const policies = rawPolicies || data?.assetAllocationPolicies || [];
  const selectedPolicy = policies.find((p: any) => p.id === values.selectedPolicyId);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error loading asset allocation policies: {error.message}
      </Alert>
    );
  }

  const handlePolicyChange = (policyId: string) => {
    setFieldValue('selectedPolicyId', policyId);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Asset Allocation Policies
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        To access the relevant information, please click on the buttons below.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button variant="outlined" sx={{ textTransform: 'none' }}>
          Asset Allocation Policies
        </Button>
        <Button variant="outlined" sx={{ textTransform: 'none' }}>
          Client's KYC
        </Button>
      </Box>

      <Box sx={{ p: 3, bgcolor: '#f5f9ff', borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Asset Allocation Policy No."
              value={values.selectedPolicyId || ''}
              onChange={(e) => handlePolicyChange(e.target.value)}
              size="small"
            >
              {policies.map((policy: any) => (
                <MenuItem key={policy.id} value={policy.id}>
                  {policy.policyNumber}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {selectedPolicy && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fixed Income"
                  value={`${selectedPolicy.fixedIncome}%`}
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Canadian Equity"
                  value={`${selectedPolicy.canadianEquity}%`}
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Global Equity"
                  value={`${selectedPolicy.globalEquity}%`}
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Alternative"
                  value={`${selectedPolicy.alternative}%`}
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </>
          )}
        </Grid>

        {selectedPolicy && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              CODE: <Box component="span" sx={{ fontWeight: 400 }}>{selectedPolicy.code}</Box>
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AssetAllocationStep;
