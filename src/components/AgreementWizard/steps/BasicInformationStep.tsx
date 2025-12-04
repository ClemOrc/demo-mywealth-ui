import React, { useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import {
  Grid,
  TextField,
  Autocomplete,
  Box,
  Typography,
  Button,
} from '@mui/material';
import { FormikProps } from 'formik';
import { GET_CLIENTS_MINIMAL, GET_CLIENT } from '@graphql/queries';
import { CreateAgreementFormValues } from '../../../types';

const agreementTypes = [
  'Wealth Management',
  'Investment Advisory',
  'Portfolio Management',
  'Financial Planning',
  'Asset Management',
  'Discretionary Management',
  'Advisory Services',
];

type Props = FormikProps<CreateAgreementFormValues>;

interface ClientOption {
  id: string;
  name: string;
}

const BasicInformationStep: React.FC<Props> = ({
  values,
  handleChange,
  setFieldValue,
}) => {
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [rawClients, setRawClients] = useState<any>(null);
  const [rawClient, setRawClient] = useState<any>(null);
  
  const { data: clientsData, loading: clientsLoading } = useQuery(GET_CLIENTS_MINIMAL, {
    variables: { searchTerm: clientSearch || '' },
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (!clientsLoading) {
      import('../../../mocks/mockStore').then(({ getMockClients }) => {
        const mockData = getMockClients();
        if (mockData) {
          setRawClients(mockData);
        }
      });
    }
  }, [clientsLoading]);

  const [getClient, { data: clientData, loading: clientLoading }] = useLazyQuery(GET_CLIENT, {
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (!clientLoading && clientData) {
      import('../../../mocks/mockStore').then(({ getMockClient }) => {
        const mockData = getMockClient();
        if (mockData) {
          setRawClient(mockData);
        }
      });
    }
  }, [clientLoading, clientData]);

  const clients: ClientOption[] = rawClients || clientsData?.clients || [];

  const handleSearchClick = () => {
    if (values.clientId) {
      // Clear previous client before fetching new one
      setSelectedClient(null);
      setRawClient(null);
      getClient({ variables: { id: values.clientId } });
    }
  };

  // Fetch client data when clientId exists (e.g., when navigating back)
  React.useEffect(() => {
    if (values.clientId && !selectedClient) {
      getClient({ variables: { id: values.clientId } });
    }
  }, [values.clientId, selectedClient, getClient]);

  // Only set selectedClient when we actually have fetched client data
  React.useEffect(() => {
    const client = rawClient || clientData?.client;
    if (client && values.clientId && client.id === values.clientId) {
      setSelectedClient(client);
    }
  }, [clientData, rawClient, values.clientId]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Client Details
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Search Client
      </Typography>
      
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <Autocomplete<ClientOption>
            options={clients}
            getOptionLabel={(option) => option.name}
            loading={clientsLoading}
            value={clients.find(c => c.id === values.clientId) || null}
            onInputChange={(_, newValue) => setClientSearch(newValue)}
            onChange={(_, value) => {
              // Clear previous client data when changing selection
              setSelectedClient(null);
              setRawClient(null);
              setFieldValue('clientId', value?.id || '');
              setFieldValue('clientName', value?.name || '');
            }}
            noOptionsText={clientSearch.length < 2 ? "Type at least 2 characters to search" : "No clients found"}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search by name or email (e.g., 'John', 'Acme')"
                size="small"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
            Or <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}>create a new one</Box>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            sx={{ textTransform: 'none' }}
            onClick={handleSearchClick}
            disabled={!values.clientId}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      {/* Client Details Display - shown after search */}
      {selectedClient && (
        <Box sx={{ mt: 4, p: 3, bgcolor: '#f5f9ff', borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Client Name</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedClient.name}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Phone No</Typography>
              <Typography variant="body1">{selectedClient.phone || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Address</Typography>
              <Typography variant="body1">{selectedClient.address || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">IA Code</Typography>
              <Typography variant="body1">{selectedClient.iaCode || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
              <Typography variant="body1">{selectedClient.dateOfBirth || 'N/A'}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Residency</Typography>
              <Typography variant="body1">
                {selectedClient.residency || 'N/A'} 
                {selectedClient.language && (
                  <Box component="span" sx={{ ml: 1, px: 1, py: 0.5, bgcolor: 'white', borderRadius: 1, fontSize: '0.75rem' }}>
                    {selectedClient.language.toUpperCase()}
                  </Box>
                )}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Client Root</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedClient.clientRoot || 'N/A'}</Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Select a Program */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Select a Program
        </Typography>
        <Box sx={{ bgcolor: '#f5f9ff', p: 3, borderRadius: 2 }}>
          <Grid container spacing={2}>
            {agreementTypes.map((type) => (
              <Grid item xs={12} key={type}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.04)' },
                    p: 1,
                    borderRadius: 1,
                  }}
                  onClick={() => setFieldValue('agreementType', type)}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: '2px solid',
                      borderColor: values.agreementType === type ? '#1976d2' : '#ccc',
                      bgcolor: values.agreementType === type ? '#1976d2' : 'transparent',
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {values.agreementType === type && (
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'white' }} />
                    )}
                  </Box>
                  <Typography>{type}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Hidden fields for required data */}
      <input
        type="hidden"
        name="startDate"
        value={values.startDate || new Date().toISOString().split('T')[0]}
        onChange={(e) => {
          setFieldValue('startDate', e.target.value);
          handleChange(e);
        }}
      />
    </Box>
  );
};

export default BasicInformationStep;
