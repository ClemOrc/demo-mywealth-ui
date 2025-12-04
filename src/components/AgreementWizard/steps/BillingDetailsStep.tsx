import React from 'react';
import { useQuery } from '@apollo/client';
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  CircularProgress,
  Alert,
} from '@mui/material';
import { FormikProps } from 'formik';
import { CreateAgreementFormValues } from '../../../types';
import { GET_HOUSEHOLD_MEMBERS } from '@graphql/queries';

type Props = FormikProps<CreateAgreementFormValues>;

const BillingDetailsStep: React.FC<Props> = ({ values, setFieldValue }) => {
  const [rawHouseholdMembers, setRawHouseholdMembers] = React.useState<any>(null);

  const { data, loading, error } = useQuery(GET_HOUSEHOLD_MEMBERS, {
    variables: { clientId: values.clientId },
    skip: !values.clientId,
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (!loading) {
      import('../../../mocks/mockStore').then(({ getMockHouseholdMembers }) => {
        const mockData = getMockHouseholdMembers();
        if (mockData) {
          setRawHouseholdMembers(mockData);
        }
      });
    }
  }, [loading]);

  const householdMembers = rawHouseholdMembers || data?.householdMembers || [];

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
        Error loading household members: {error.message}
      </Alert>
    );
  }
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Billing Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            select
            label="Frequency"
            placeholder="Enter frequency"
            value={values.billingFrequency}
            onChange={(e) => setFieldValue('billingFrequency', e.target.value)}
            size="small"
          >
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="Quarterly">Quarterly</MenuItem>
            <MenuItem value="Annually">Annually</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            placeholder="Enter Start Date"
            value={values.billingStartDate}
            onChange={(e) => setFieldValue('billingStartDate', e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Billing Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          All household members should be billed for their own fee
        </Typography>
        <TextField
          fullWidth
          select
          value={values.billingAccount}
          onChange={(e) => setFieldValue('billingAccount', e.target.value)}
          size="small"
        >
          <MenuItem value="individual">Bill all accounts individually</MenuItem>
          <MenuItem value="combined">Bill all accounts together</MenuItem>
        </TextField>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Household Billing
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Household billing does not entail to household investment management. By adding members to your household, you understand and accept that all members may know the total value of all members billable assets. Only accounts falling within the mywealth - All inclusive program categories can be included in the same household as a myWealth Unified account.
        </Typography>

        {!values.clientId && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please select a client in the first step to view household members.
          </Alert>
        )}

        {values.clientId && householdMembers.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            No household members found for this client.
          </Alert>
        )}

        <FormGroup>
          {householdMembers.map((member: any) => (
            <Box
              key={member.id}
              sx={{
                p: 2,
                mb: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.selectedHouseholdMembers?.includes(member.id) || false}
                      onChange={(e) => {
                        const newMembers = e.target.checked
                          ? [...(values.selectedHouseholdMembers || []), member.id]
                          : (values.selectedHouseholdMembers || []).filter((id: string) => id !== member.id);
                        setFieldValue('selectedHouseholdMembers', newMembers);
                      }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.relation}
                      </Typography>
                      {member.accounts && member.accounts.length > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          Accounts: {member.accounts.map((account: any) => account.accountNumber).join(', ')}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    ${member.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Value
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </FormGroup>
      </Box>
    </Box>
  );
};

export default BillingDetailsStep;
