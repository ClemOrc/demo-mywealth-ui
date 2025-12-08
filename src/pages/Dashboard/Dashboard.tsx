import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Card,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { GET_AGREEMENTS, GET_DASHBOARD_STATS } from '@graphql/queries';
import { useAppContext } from '@contexts/AppContext';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { useAgreementActions } from '../../hooks/useAgreementActions';
import { COLORS, DEFAULT_PAGE_SIZE } from '../../constants';
import AgreementTable from './components/AgreementTable';
import AgreementFilters from './components/AgreementFilters';
import ConfirmationModal from '../../components/ConfirmationModal';
import ToastNotification from '../../components/ToastNotification';
import { AgreementStatus, Agreement } from '../../types';

interface ConfirmationState {
  open: boolean;
  agreementId: string | null;
  action: 'approve' | 'decline' | null;
  agreementNumber?: string;
}

interface ToastState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

const Dashboard: React.FC = () => {
  const nav = useAppNavigation();
  const { filters, setFilters } = useAppContext();
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const { approveAgreement, declineAgreement, loading: actionLoading } = useAgreementActions();

  // State for confirmation modal
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>({
    open: false,
    agreementId: null,
    action: null,
  });

  // State for toast notifications
  const [toastState, setToastState] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Local state for optimistic UI updates
  const [localAgreements, setLocalAgreements] = useState<Agreement[]>([]);
  const [localStats, setLocalStats] = useState<any>(null);

  const { data: statsData, loading: statsLoading } = useQuery(GET_DASHBOARD_STATS, {
    fetchPolicy: 'network-only',
  });

  // WORKAROUND: Get raw stats data from store
  const [rawStatsData, setRawStatsData] = React.useState<any>(null);
  
  React.useEffect(() => {
    import('../../mocks/mockStore').then(({ getMockDashboardStats }) => {
      const mockStats = getMockDashboardStats();
      if (mockStats) {
        setRawStatsData(mockStats);
        setLocalStats(mockStats);
      }
    });
  }, [statsLoading]);

  const { data: agreementsData, loading: agreementsLoading, refetch } = useQuery(
    GET_AGREEMENTS,
    {
      variables: {
        filters,
        pagination: {
          page: page + 1,
          pageSize,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        },
      },
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
    }
  );

  // WORKAROUND: Get raw mock data from store (bypasses Apollo's field filtering)
  const [rawAgreementsData, setRawAgreementsData] = React.useState<any>(null);
  
  React.useEffect(() => {
    // Import the store dynamically to get latest data
    import('../../mocks/mockStore').then(({ getMockAgreements }) => {
      const mockData = getMockAgreements();
      if (mockData) {
        console.log('✅ Got raw mock data from store:', mockData);
        setRawAgreementsData(mockData);
        setLocalAgreements(mockData.data || []);
      }
    });
  }, [agreementsLoading, agreementsData]); // Re-fetch when query completes or data changes
  
  // Refetch when component mounts (e.g., returning from another page)
  React.useEffect(() => {
    refetch();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setPage(0);
    
    // Apply status filter based on tab
    const statusFilters: { [key: number]: AgreementStatus[] | undefined } = {
      0: [AgreementStatus.PENDING_APPROVAL], // Changed: Pending first
      1: [AgreementStatus.ACTIVE],
      2: [AgreementStatus.DRAFT],
      3: [AgreementStatus.EXPIRED, AgreementStatus.TERMINATED],
      4: undefined, // All
    };
    
    setFilters({ ...filters, status: statusFilters[newValue] });
  };

  const handleCreateAgreement = () => {
    nav.goToCreateAgreement();
  };

  const handleRowClick = (agreementId: string) => {
    nav.goToAgreementDetails(agreementId);
  };

  // Handle approve action
  const handleApprove = (agreementId: string) => {
    const agreement = localAgreements.find((a) => a.id === agreementId);
    setConfirmationState({
      open: true,
      agreementId,
      action: 'approve',
      agreementNumber: agreement?.agreementNumber,
    });
  };

  // Handle decline action
  const handleDecline = (agreementId: string) => {
    const agreement = localAgreements.find((a) => a.id === agreementId);
    setConfirmationState({
      open: true,
      agreementId,
      action: 'decline',
      agreementNumber: agreement?.agreementNumber,
    });
  };

  // Confirm action
  const handleConfirmAction = async () => {
    if (!confirmationState.agreementId || !confirmationState.action) return;

    const agreementId = confirmationState.agreementId;
    const action = confirmationState.action;

    // Close confirmation modal
    setConfirmationState({ open: false, agreementId: null, action: null });

    try {
      if (action === 'approve') {
        await approveAgreement(agreementId);
        // Optimistically update local state
        setLocalAgreements((prev) => prev.filter((a) => a.id !== agreementId));
        setLocalStats((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            pendingApprovalAgreements: Math.max(0, (prev.pendingApprovalAgreements || 0) - 1),
            activeAgreements: (prev.activeAgreements || 0) + 1,
          };
        });
        setToastState({
          open: true,
          message: `Agreement ${confirmationState.agreementNumber} approved successfully!`,
          severity: 'success',
        });
      } else if (action === 'decline') {
        await declineAgreement(agreementId);
        // Optimistically update local state
        setLocalAgreements((prev) => prev.filter((a) => a.id !== agreementId));
        setLocalStats((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            pendingApprovalAgreements: Math.max(0, (prev.pendingApprovalAgreements || 0) - 1),
            expiredAgreements: (prev.expiredAgreements || 0) + 1,
          };
        });
        setToastState({
          open: true,
          message: `Agreement ${confirmationState.agreementNumber} declined successfully.`,
          severity: 'success',
        });
      }
      
      // Refetch to sync with backend
      setTimeout(() => {
        refetch();
      }, 500);
    } catch (error) {
      console.error('Error processing agreement action:', error);
      setToastState({
        open: true,
        message: `Failed to ${action} agreement. Please try again.`,
        severity: 'error',
      });
      // Revert optimistic update by refetching
      refetch();
    }
  };

  // Cancel action
  const handleCancelAction = () => {
    setConfirmationState({ open: false, agreementId: null, action: null });
  };

  // Close toast
  const handleCloseToast = () => {
    setToastState({ ...toastState, open: false });
  };

  // Use local state for optimistic updates, otherwise fall back to raw/Apollo data
  const agreements = localAgreements.length > 0 
    ? localAgreements 
    : (rawAgreementsData?.data || agreementsData?.agreements?.data || []);
  const total = rawAgreementsData?.total || agreementsData?.agreements?.total || 0;

  interface TabCounts {
    all: number;
    active: number;
    pending: number;
    draft: number;
    deleted: number;
  }

  const getTabCounts = (): TabCounts => {
    const stats = localStats || rawStatsData || statsData?.dashboardStats;
    if (!stats) {
      return { all: 0, active: 0, pending: 0, draft: 0, deleted: 0 };
    }
    
    return {
      all: stats.totalAgreements || 0,
      active: stats.activeAgreements || 0,
      pending: stats.pendingApprovalAgreements || 0,
      draft: stats.draftAgreements || 0,
      deleted: (stats.expiredAgreements || 0) + (stats.terminatedAgreements || 0),
    };
  };

  const tabCounts = getTabCounts();

  const getConfirmationMessage = () => {
    if (confirmationState.action === 'approve') {
      return `Are you sure you want to approve agreement ${confirmationState.agreementNumber}? This will change its status to ACTIVE.`;
    } else if (confirmationState.action === 'decline') {
      return `Are you sure you want to decline agreement ${confirmationState.agreementNumber}? This will change its status to EXPIRED.`;
    }
    return '';
  };

  return (
    <Box sx={{ bgcolor: COLORS.BACKGROUND_GRAY, minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
        <Button
          variant="contained"
          onClick={handleCreateAgreement}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
          }}
        >
          Create a new agreement
        </Button>
      </Box>

      {/* Main Content Card */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {/* Search Section */}
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Search
          </Typography>
          <AgreementFilters
            filters={filters}
            onFiltersChange={setFilters}
            onRefresh={refetch}
          />
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            sx={{
              px: 2,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
              },
            }}
          >
            <Tab label={`Pending (${tabCounts.pending})`} />
            <Tab label={`Active (${tabCounts.active})`} />
            <Tab label={`Drafts (${tabCounts.draft})`} />
            <Tab label={`Deleted (${tabCounts.deleted})`} />
            <Tab label={`All (${tabCounts.all})`} />
          </Tabs>
        </Box>

        {/* Agreements Table */}
        <Box sx={{ p: 0 }}>
          <AgreementTable
            agreements={agreements}
            loading={agreementsLoading || actionLoading}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onRowClick={handleRowClick}
            onApprove={handleApprove}
            onDecline={handleDecline}
          />
        </Box>
      </Card>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={confirmationState.open}
        title={confirmationState.action === 'approve' ? 'Approve Agreement' : 'Decline Agreement'}
        message={getConfirmationMessage()}
        confirmText={confirmationState.action === 'approve' ? 'Approve' : 'Decline'}
        cancelText="Cancel"
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        confirmColor={confirmationState.action === 'approve' ? 'success' : 'error'}
      />

      {/* Toast Notification */}
      <ToastNotification
        open={toastState.open}
        message={toastState.message}
        severity={toastState.severity}
        onClose={handleCloseToast}
      />
    </Box>
  );
};

export default Dashboard;