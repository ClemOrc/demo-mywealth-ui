import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import {
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { GET_AGREEMENT_BY_ID, GET_CLIENT_ACCOUNTS } from '@graphql/queries';
import { CREATE_MODIFICATION_REQUEST } from '@graphql/mutations';
import { useAppContext } from '@contexts/AppContext';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { CreateAgreementFormValues, NotificationType } from '../../types';
import AgreementWizard from '@/components/AgreementWizard';

const ModifyAgreement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useAppNavigation();
  const { addNotification } = useAppContext();
  const [rawAgreement, setRawAgreement] = React.useState<any>(null);
  const [rawAccounts, setRawAccounts] = React.useState<any>(null);

  const { data, loading, error, refetch } = useQuery(GET_AGREEMENT_BY_ID, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (!loading) {
      import('../../mocks/mockStore').then(({ getMockAgreement }) => {
        const mockData = getMockAgreement();
        if (mockData) {
          setRawAgreement(mockData);
        }
      });
    }
  }, [loading]);

  // Fetch client accounts to get selected accounts
  const { data: accountsData, loading: accountsLoading } = useQuery(GET_CLIENT_ACCOUNTS, {
    variables: { clientId: data?.agreement?.clientId },
    skip: !data?.agreement?.clientId,
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (!accountsLoading) {
      import('../../mocks/mockStore').then(({ getMockClientAccounts }) => {
        const mockData = getMockClientAccounts();
        if (mockData) {
          setRawAccounts(mockData);
        }
      });
    }
  }, [accountsLoading]);

  const [createModificationRequest, { loading: submitting }] = useMutation(
    CREATE_MODIFICATION_REQUEST
  );

  const agreement = rawAgreement || data?.agreement;
  const accounts = rawAccounts || accountsData?.clientAccounts || [];
  
  // Initialize form values from existing agreement data
  const initialValues: CreateAgreementFormValues = {
    agreementType: agreement?.agreementType || '',
    clientId: agreement?.clientId || '',
    clientName: agreement?.clientName || '',
    startDate: agreement?.startDate || new Date().toISOString().split('T')[0],
    endDate: agreement?.endDate || '',
    selectedAccounts: agreement?.selectedAccounts || (accounts.length > 0 ? [accounts[0].id] : []),
    selectedPolicyId: '4', // Default to AAP-004 (matches the CODE shown)
    billingFrequency: 'Monthly',
    billingStartDate: agreement?.startDate || new Date().toISOString().split('T')[0],
    billingAccount: 'individual',
    selectedHouseholdMembers: ['HH006'], // James Davis (Partner) for client 5
    programType: agreement?.agreementType || 'Wealth Management - Unified',
    feeType: 'Dynamic',
    currentFeeAccount: 'yes',
    products: agreement?.products || [],
    terms: agreement?.terms || [],
    documents: agreement?.documents || [],
    comments: agreement?.comments || '',
  };

  const handleSubmit = async (values: CreateAgreementFormValues) => {
    try {
      await createModificationRequest({
        variables: {
          input: {
            agreementId: id,
            requestType: 'UPDATE',
            reason: 'Agreement modification through wizard',
            comments: values.comments,
            changes: [], // In real implementation, track what changed
          },
        },
      });

      addNotification({
        type: NotificationType.MODIFICATION_REQUESTED,
        message: 'Modification request submitted successfully',
        severity: 'success',
      });

      nav.goToPendingModifications();
    } catch (error) {
      addNotification({
        type: NotificationType.MODIFICATION_REQUESTED,
        message: `Failed to submit modification request: ${error}`,
        severity: 'error',
      });
    }
  };

  if (loading || accountsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data?.agreement) {
    return (
      <Box>
        <Alert severity="error">
          Failed to load agreement details. Please try again.
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={() => refetch()} size="small">
              Retry
            </Button>
            <Button variant="outlined" onClick={() => nav.goToDashboard()} size="small">
              Back to Dashboard
            </Button>
          </Box>
        </Alert>
      </Box>
    );
  }

  return (
    <AgreementWizard
      title="Modify UMA Agreement"
      referenceNumber="277"
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={() => nav.goToAgreementDetails(id!)}
      submitButtonText="Submit Changes"
      submitting={submitting}
    />
  );
};

export default ModifyAgreement;
