import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { GET_AGREEMENT_BY_ID } from '@graphql/queries';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import AgreementDetailsView from '@/components/AgreementDetailsView';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const AgreementDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useAppNavigation();
  const [activeTab, setActiveTab] = React.useState(0);
  const [rawAgreement, setRawAgreement] = React.useState<any>(null);

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

  const handleBack = () => {
    nav.goToDashboard();
  };

  const handleModify = () => {
    nav.goToModifyAgreement(id!);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const agreement = rawAgreement || data?.agreement;

  if (error || !agreement) {
    return (
      <Box>
        <Alert severity="error">
          Failed to load agreement details. Please try again.
        </Alert>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button startIcon={<BackIcon />} onClick={handleBack} sx={{ mr: 2 }}>
            Back
          </Button>
          <Typography variant="h4">
            Agreement: {agreement.agreementNumber}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleModify}
        >
          Modify Agreement
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Overview" />
          <Tab label="History" />
          <Tab label="Documents" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <AgreementDetailsView agreement={agreement} />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="body1" color="text.secondary">
            History view coming soon...
          </Typography>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="body1" color="text.secondary">
            Documents view coming soon...
          </Typography>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default AgreementDetails;
