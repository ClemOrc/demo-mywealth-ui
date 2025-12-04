import React from 'react';
import { useQuery } from '@apollo/client';
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { FormikProps } from 'formik';
import { CreateAgreementFormValues } from '../../../types';
import { GET_PROGRAM_FEES } from '@graphql/queries';

type Props = FormikProps<CreateAgreementFormValues>;

const ProgramFeesStep: React.FC<Props> = ({ values, setFieldValue }) => {
  const [rawProgramFees, setRawProgramFees] = React.useState<any>(null);

  const { data, loading, error } = useQuery(GET_PROGRAM_FEES, {
    variables: { programType: values.programType },
    skip: !values.programType,
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (!loading) {
      import('../../../mocks/mockStore').then(({ getMockProgramFees }) => {
        const mockData = getMockProgramFees();
        if (mockData) {
          setRawProgramFees(mockData);
        }
      });
    }
  }, [loading]);

  const programFee = rawProgramFees || data?.programFees;

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
        Error loading program fees: {error.message}
      </Alert>
    );
  }
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Program Fees
      </Typography>

      <Box sx={{ p: 3, bgcolor: '#f5f9ff', borderRadius: 2, mb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          Client billable assets in {values.programType} ($)
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          {programFee?.billableAssets ? `$${programFee.billableAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$0.00'}
        </Typography>
        {programFee && programFee.billableAssets < programFee.minAmount && (
          <Alert severity="error" sx={{ mb: 2 }}>
            The minimum amount required for this program is ${programFee.minAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Alert>
        )}
        <Typography variant="body2" color="text.secondary">
          Total household billable assets in myWEALTH - All inclusive: $0.00
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Program Type"
            value={values.programType}
            onChange={(e) => setFieldValue('programType', e.target.value)}
            size="small"
          >
            <MenuItem value="Premium Wealth Management">Premium Wealth Management</MenuItem>
            <MenuItem value="Standard Wealth Management">Standard Wealth Management</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Program Fee Type"
            value={programFee?.feeType || ''}
            size="small"
            InputProps={{ readOnly: true }}
          />
        </Grid>
      </Grid>

      {programFee && (
        <>
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              The following fee schedule of annual rates will be applied to the above mentioned billable assets
            </Typography>
            <TextField
              fullWidth
              label="Fee Schedule"
              value={programFee.feeSchedule}
              size="small"
              sx={{ mb: 3 }}
              InputProps={{ readOnly: true }}
            />

            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Assets</TableCell>
                    <TableCell align="right">Annual Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {programFee.feeRates?.map((rate: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{rate.tier}</TableCell>
                      <TableCell align="right">{rate.rate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Integration Period"
                value={programFee.integrationPeriod}
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Purpose"
                value={programFee.purpose}
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </>
      )}

      <Box sx={{ mt: 4 }}>
        <Box sx={{ p: 3, bgcolor: '#f5f9ff', borderRadius: 2 }}>
          <RadioGroup
            value={values.currentFeeAccount}
            onChange={(e) => setFieldValue('currentFeeAccount', e.target.value)}
          >
            <FormControlLabel
              value="yes"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    You already have a fee-based account
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Current fee-based account type
                  </Typography>
                  <TextField
                    fullWidth
                    select
                    value={values.feeType || 'advisory'}
                    onChange={(e) => setFieldValue('feeType', e.target.value)}
                    size="small"
                    sx={{ mt: 1 }}
                    disabled={values.currentFeeAccount !== 'yes'}
                  >
                    <MenuItem value="advisory">myWealth - Advisory</MenuItem>
                    <MenuItem value="managed">myWealth - Managed</MenuItem>
                  </TextField>
                </Box>
              }
            />
            <FormControlLabel
              value="no"
              control={<Radio />}
              label="Your account is not a fee-based platform currently"
              sx={{ mt: 2 }}
            />
          </RadioGroup>
        </Box>
      </Box>
    </Box>
  );
};

export default ProgramFeesStep;
