import React from 'react';
import { useQuery } from '@apollo/client';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Alert,
  Link,
  CircularProgress,
} from '@mui/material';
import { FormikProps } from 'formik';
import { CreateAgreementFormValues } from '../../../types';
import { GET_CLIENT_ACCOUNTS } from '@graphql/queries';

type Props = FormikProps<CreateAgreementFormValues>;

const InvestingAccountStep: React.FC<Props> = ({ values, setFieldValue }) => {
  const [rawAccounts, setRawAccounts] = React.useState<any>(null);

  const { data, loading, error } = useQuery(GET_CLIENT_ACCOUNTS, {
    variables: { clientId: values.clientId },
    skip: !values.clientId,
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (!loading) {
      import('../../../mocks/mockStore').then(({ getMockClientAccounts }) => {
        const mockData = getMockClientAccounts();
        if (mockData) {
          setRawAccounts(mockData);
        }
      });
    }
  }, [loading]);

  const accounts = rawAccounts || data?.clientAccounts || [];

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
        Error loading accounts: {error.message}
      </Alert>
    );
  }

  if (!values.clientId) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        Please select a client in the previous step to view accounts.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Select Investing Account
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Have you created your account?
        </Typography>
        <Typography variant="body2">
          You won't be able to submit your agreement request unless your account is set up. You can create an account using the link below.
        </Typography>
        <Link href="#" sx={{ display: 'block', mt: 1 }}>
          Investor Profile Manager
        </Link>
      </Alert>

      <FormGroup>
        {accounts.map((account: any) => (
          <Box
            key={account.id}
            sx={{
              p: 2,
              mb: 2,
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              bgcolor: account.isEligible ? 'white' : '#f5f5f5',
              opacity: account.isEligible ? 1 : 0.6,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={!account.isEligible}
                    checked={values.selectedAccounts?.includes(account.id) || false}
                    onChange={(e) => {
                      const newAccounts = e.target.checked
                        ? [...(values.selectedAccounts || []), account.id]
                        : (values.selectedAccounts || []).filter((id: string) => id !== account.id);
                      setFieldValue('selectedAccounts', newAccounts);
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {account.accountType} ({account.currency})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {account.accountNumber}
                    </Typography>
                    {!account.isEligible && (
                      <Typography variant="caption" color="error">
                        (Not eligible)
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Program: {account.programType}
                    </Typography>
                  </Box>
                }
              />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {account.currency} ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Typography>
            </Box>
          </Box>
        ))}
      </FormGroup>
    </Box>
  );
};

export default InvestingAccountStep;
