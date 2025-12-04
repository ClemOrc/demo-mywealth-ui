import React from 'react';
import { useQuery } from '@apollo/client';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Checkbox,
} from '@mui/material';
import { Description as DescriptionIcon } from '@mui/icons-material';
import { Agreement } from '../types';
import { format } from 'date-fns';
import { GET_CLIENT, GET_HOUSEHOLD_MEMBERS, GET_ASSET_ALLOCATION_POLICIES, GET_PROGRAM_FEES } from '@graphql/queries';

interface AgreementDetailsViewProps {
  agreement: Agreement;
}

const AgreementDetailsView: React.FC<AgreementDetailsViewProps> = ({ agreement }) => {
  const [rawClient, setRawClient] = React.useState<any>(null);
  const [rawHousehold, setRawHousehold] = React.useState<any>(null);
  const [rawPolicies, setRawPolicies] = React.useState<any>(null);
  const [rawFees, setRawFees] = React.useState<any>(null);

  // Fetch additional client details
  const { data: clientData, loading: clientLoading } = useQuery(GET_CLIENT, {
    variables: { id: agreement.clientId },
    skip: !agreement.clientId,
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (!clientLoading) {
      import('../mocks/mockStore').then(({ getMockClient }) => {
        const mockData = getMockClient();
        if (mockData) {
          setRawClient(mockData);
        }
      });
    }
  }, [clientLoading]);

  // Fetch household members
  const { data: householdData, loading: householdLoading } = useQuery(GET_HOUSEHOLD_MEMBERS, {
    variables: { clientId: agreement.clientId },
    skip: !agreement.clientId,
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (!householdLoading) {
      import('../mocks/mockStore').then(({ getMockHouseholdMembers }) => {
        const mockData = getMockHouseholdMembers();
        if (mockData) {
          setRawHousehold(mockData);
        }
      });
    }
  }, [householdLoading]);

  // Fetch asset allocation policies
  const { data: policiesData, loading: policiesLoading } = useQuery(GET_ASSET_ALLOCATION_POLICIES, {
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (!policiesLoading) {
      import('../mocks/mockStore').then(({ getMockAssetAllocationPolicies }) => {
        const mockData = getMockAssetAllocationPolicies();
        if (mockData) {
          setRawPolicies(mockData);
        }
      });
    }
  }, [policiesLoading]);

  // Fetch program fees
  const { data: feesData, loading: feesLoading } = useQuery(GET_PROGRAM_FEES, {
    variables: { programType: agreement.agreementType },
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (!feesLoading) {
      import('../mocks/mockStore').then(({ getMockProgramFees }) => {
        const mockData = getMockProgramFees();
        if (mockData) {
          setRawFees(mockData);
        }
      });
    }
  }, [feesLoading]);

  const client = rawClient || clientData?.client;
  const householdMembers = rawHousehold || householdData?.householdMembers || [];
  const allPolicies = rawPolicies || policiesData?.assetAllocationPolicies || [];
  // Filter to show only the selected policy
  const policies = agreement.selectedPolicyId 
    ? allPolicies.filter((p: any) => p.id === agreement.selectedPolicyId)
    : allPolicies;
  const programFees = rawFees || feesData?.programFees;
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const isLoading = clientLoading || householdLoading || policiesLoading || feesLoading;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Client Details */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Client Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {client ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">Client Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{client.name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                <Typography variant="body1">{client.dateOfBirth || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Client Root</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{agreement.clientRoot || client.clientRoot || 'N/A'}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">Address</Typography>
                <Typography variant="body1">{client.address || 'N/A'}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">Phone No</Typography>
                <Typography variant="body1">{client.phone || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">IA Code</Typography>
                <Typography variant="body1">{agreement.iaCode || client.iaCode || 'N/A'}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">Agreement Type</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{agreement.agreementType || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Residency</Typography>
                <Typography variant="body1">
                  {client.residency || 'N/A'}
                  {client.language && (
                    <Box component="span" sx={{ ml: 1, px: 1, py: 0.5, bgcolor: '#e3f2fd', borderRadius: 1, fontSize: '0.75rem', fontWeight: 600 }}>
                      {client.language.toUpperCase()}
                    </Box>
                  )}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Typography color="text.secondary">No client information available</Typography>
        )}
      </Paper>

      {/* Asset Allocation Policies */}
      {policies && policies.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Asset Allocation Policies
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {policies.map((policy: any, index: number) => (
            <Box key={policy.id || index}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={4}>
                  <Typography variant="caption" color="text.secondary">Asset Allocation Policy No.</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{policy.name || policy.id}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="caption" color="text.secondary">Fixed Income</Typography>
                  <Typography variant="body1">{policy.fixedIncome || 'Index Plus'}</Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={4}>
                  <Typography variant="caption" color="text.secondary">Canadian Equity</Typography>
                  <Typography variant="body1">{policy.canadianEquity || 'Blend'}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="caption" color="text.secondary">Global Equity</Typography>
                  <Typography variant="body1">{policy.globalEquity || 'Blend'}</Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="caption" color="text.secondary">Alternative</Typography>
                  <Typography variant="body1">{policy.alternative || 'Blend'}</Typography>
                </Grid>
              </Grid>
              {policy.code && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">CODE: </Typography>
                  <Typography variant="body1" component="span" sx={{ fontWeight: 600 }}>{policy.code}</Typography>
                </Box>
              )}
            </Box>
          ))}
        </Paper>
      )}

      {/* Billing Details */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Billing Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary">Frequency</Typography>
            <Typography variant="body1">Monthly</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" color="text.secondary">Start Date</Typography>
            <Typography variant="body1">{formatDate(agreement.startDate)}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">Billing Account</Typography>
            <Typography variant="body1">Bill all accounts individually</Typography>
          </Grid>
        </Grid>

        {/* Household Billing */}
        {householdMembers && householdMembers.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Household Billing
            </Typography>
            {householdMembers.map((member: any) => (
              <Box key={member.id} sx={{ mb: 3, p: 2, bgcolor: '#f5f9ff', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Checkbox checked={true} disabled />
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{member.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{member.relation}</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    $ {member.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                {member.accounts && member.accounts.length > 0 && (
                  <Box sx={{ ml: 5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Accounts</Typography>
                    {member.accounts.map((acc: any) => (
                      <Box key={acc.id} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Checkbox checked={true} disabled size="small" />
                        <Typography variant="body2" sx={{ ml: 1, flex: 1 }}>
                          <strong>{acc.accountType}</strong> {acc.accountNumber} <span style={{ color: '#666' }}>- {acc.currency}</span>
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          $ {acc.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* Program Fees */}
      {programFees && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Program Fees
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Client Billable Assets in myWealth - Unified</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                $ {programFees.billableAssets?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '18,000.00'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Program Fee Type</Typography>
              <Typography variant="body1">{programFees.feeType || 'Dynamic'}</Typography>
            </Grid>
          </Grid>

          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" color="text.secondary">Fee Schedule</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>{programFees.feeSchedule || 'UMOS'}</Typography>
            
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Assets</TableCell>
                  <TableCell align="right">Annual Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {programFees.feeRates && programFees.feeRates.length > 0 ? (
                  programFees.feeRates.map((rate: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>% on {rate.tier}</TableCell>
                      <TableCell align="right">{rate.rate}%</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <>
                    <TableRow>
                      <TableCell>% on the first $250,000</TableCell>
                      <TableCell align="right">1.30%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>% on $250,000 to $600,000</TableCell>
                      <TableCell align="right">1.00%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>% on $600,000 to $1,000,000</TableCell>
                      <TableCell align="right">0.90%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>% on $1,000,000 to $2,500,000</TableCell>
                      <TableCell align="right">0.75%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>% on assets exceeding $2,500,000</TableCell>
                      <TableCell align="right">0.70%</TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Internal Use Code:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {programFees.internalCode || 'UMOS'}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">Total household billable assets in myWealth - All inclusive:</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              $ {programFees.totalBillableAssets?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '113,000.00'}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Asset Allocation Policy Integration Period</Typography>
              <Typography variant="body1">At the portfolio manager's discretion</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">Purpose of Agreement</Typography>
              <Typography variant="body1">Establish a myWealth Unified agreement</Typography>
            </Grid>
          </Grid>

          {programFees.otherFeeAccount && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">Other Fee Based Account</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {programFees.otherFeeAccount}
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Documents */}
      {agreement.documents && agreement.documents.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Attachments
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {agreement.documents.map((doc: any) => (
              <Box key={doc.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DescriptionIcon sx={{ color: 'text.secondary' }} />
                <Typography variant="body2">{doc.documentName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {doc.documentType}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* Notes */}
      {agreement.comments && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Notes
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ p: 2, bgcolor: '#f5f9ff', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {formatDate(agreement.updatedAt)} - {agreement.modifiedBy || agreement.createdBy}
            </Typography>
            <Typography variant="body1">{agreement.comments}</Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AgreementDetailsView;
