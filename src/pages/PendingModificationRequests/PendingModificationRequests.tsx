import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import {
  GET_MODIFICATION_REQUESTS,
} from '@graphql/queries';
import {
  APPROVE_MODIFICATION_REQUEST,
  REJECT_MODIFICATION_REQUEST,
} from '@graphql/mutations';
import { useAppContext } from '@contexts/AppContext';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { ModificationRequestStatus, NotificationType } from '../../types';
import ModificationRequestsTable from './components/ModificationRequestsTable';
import ModificationRequestDialog from './components/ModificationRequestDialog';

const PendingModificationRequests: React.FC = () => {
  const nav = useAppNavigation();
  const { addNotification } = useAppContext();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rawModificationRequests, setRawModificationRequests] = useState<any>(null);

  const statusFilters: { [key: number]: ModificationRequestStatus[] | undefined } = {
    0: [ModificationRequestStatus.PENDING],
    1: [ModificationRequestStatus.APPROVED],
    2: [ModificationRequestStatus.REJECTED],
    3: undefined, // All
  };

  const { data, loading, refetch } = useQuery(GET_MODIFICATION_REQUESTS, {
    variables: {
      filters: {
        status: statusFilters[activeTab],
      },
      pagination: {
        page: page + 1,
        pageSize,
        sortBy: 'requestedAt',
        sortOrder: 'desc',
      },
    },
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (!loading) {
      import('../../mocks/mockStore').then(({ getMockModificationRequests }) => {
        const mockData = getMockModificationRequests();
        if (mockData) {
          setRawModificationRequests(mockData);
        }
      });
    }
  }, [loading]);

  const [approveRequest, { loading: approving }] = useMutation(APPROVE_MODIFICATION_REQUEST);
  const [rejectRequest, { loading: rejecting }] = useMutation(REJECT_MODIFICATION_REQUEST);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setPage(0);
  };

  const handleBack = () => {
    nav.goToDashboard();
  };

  const handleRowClick = (request: any) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleApprove = async (requestId: string, comments?: string) => {
    try {
      await approveRequest({
        variables: { id: requestId, comments },
      });

      addNotification({
        type: NotificationType.MODIFICATION_APPROVED,
        message: 'Modification request approved successfully',
        severity: 'success',
      });

      setDialogOpen(false);
      refetch();
    } catch (error) {
      addNotification({
        type: NotificationType.MODIFICATION_APPROVED,
        message: `Failed to approve request: ${error}`,
        severity: 'error',
      });
    }
  };

  const handleReject = async (requestId: string, reason: string) => {
    try {
      await rejectRequest({
        variables: { id: requestId, reason },
      });

      addNotification({
        type: NotificationType.MODIFICATION_REJECTED,
        message: 'Modification request rejected',
        severity: 'info',
      });

      setDialogOpen(false);
      refetch();
    } catch (error) {
      addNotification({
        type: NotificationType.MODIFICATION_REJECTED,
        message: `Failed to reject request: ${error}`,
        severity: 'error',
      });
    }
  };

  const modificationRequestsData = rawModificationRequests || data?.modificationRequests;
  const requests = modificationRequestsData?.data || [];
  const total = modificationRequestsData?.total || 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<BackIcon />} onClick={handleBack} sx={{ mr: 2 }}>
          Back
        </Button>
        <Typography variant="h4">Pending Modification Requests</Typography>
      </Box>

      <Card>
        <CardContent>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Pending" />
            <Tab label="Approved" />
            <Tab label="Rejected" />
            <Tab label="All Requests" />
          </Tabs>

          <ModificationRequestsTable
            requests={requests}
            loading={loading}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>

      {selectedRequest && (
        <ModificationRequestDialog
          open={dialogOpen}
          request={selectedRequest}
          onClose={() => setDialogOpen(false)}
          onApprove={handleApprove}
          onReject={handleReject}
          approving={approving}
          rejecting={rejecting}
        />
      )}
    </Box>
  );
};

export default PendingModificationRequests;
