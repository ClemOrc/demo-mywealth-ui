// Temporary store for raw mock data
// This bypasses Apollo's field filtering
export const mockDataStore = {
  lastAgreementsResponse: null as any,
  lastDashboardStatsResponse: null as any,
  lastAgreementResponse: null as any,
  lastClientsResponse: null as any,
  lastClientResponse: null as any,
  lastClientAccountsResponse: null as any,
  lastHouseholdMembersResponse: null as any,
  lastProductsResponse: null as any,
  lastAssetAllocationPoliciesResponse: null as any,
  lastProgramFeesResponse: null as any,
  lastModificationRequestsResponse: null as any,
  lastModificationRequestResponse: null as any,
};

// Agreements list
export const setMockAgreements = (data: any) => {
  mockDataStore.lastAgreementsResponse = data;
};

export const getMockAgreements = () => {
  return mockDataStore.lastAgreementsResponse;
};

// Dashboard stats
export const setMockDashboardStats = (data: any) => {
  mockDataStore.lastDashboardStatsResponse = data;
};

export const getMockDashboardStats = () => {
  return mockDataStore.lastDashboardStatsResponse;
};

// Single agreement
export const setMockAgreement = (data: any) => {
  mockDataStore.lastAgreementResponse = data;
};

export const getMockAgreement = () => {
  return mockDataStore.lastAgreementResponse;
};

// Clients list
export const setMockClients = (data: any) => {
  mockDataStore.lastClientsResponse = data;
};

export const getMockClients = () => {
  return mockDataStore.lastClientsResponse;
};

// Single client
export const setMockClient = (data: any) => {
  mockDataStore.lastClientResponse = data;
};

export const getMockClient = () => {
  return mockDataStore.lastClientResponse;
};

// Client accounts
export const setMockClientAccounts = (data: any) => {
  mockDataStore.lastClientAccountsResponse = data;
};

export const getMockClientAccounts = () => {
  return mockDataStore.lastClientAccountsResponse;
};

// Household members
export const setMockHouseholdMembers = (data: any) => {
  mockDataStore.lastHouseholdMembersResponse = data;
};

export const getMockHouseholdMembers = () => {
  return mockDataStore.lastHouseholdMembersResponse;
};

// Products
export const setMockProducts = (data: any) => {
  mockDataStore.lastProductsResponse = data;
};

export const getMockProducts = () => {
  return mockDataStore.lastProductsResponse;
};

// Asset allocation policies
export const setMockAssetAllocationPolicies = (data: any) => {
  mockDataStore.lastAssetAllocationPoliciesResponse = data;
};

export const getMockAssetAllocationPolicies = () => {
  return mockDataStore.lastAssetAllocationPoliciesResponse;
};

// Program fees
export const setMockProgramFees = (data: any) => {
  mockDataStore.lastProgramFeesResponse = data;
};

export const getMockProgramFees = () => {
  return mockDataStore.lastProgramFeesResponse;
};

// Modification requests list
export const setMockModificationRequests = (data: any) => {
  mockDataStore.lastModificationRequestsResponse = data;
};

export const getMockModificationRequests = () => {
  return mockDataStore.lastModificationRequestsResponse;
};

// Single modification request
export const setMockModificationRequest = (data: any) => {
  mockDataStore.lastModificationRequestResponse = data;
};

export const getMockModificationRequest = () => {
  return mockDataStore.lastModificationRequestResponse;
};

// Clear cache for agreements and stats (call after mutations)
export const clearAgreementsCache = () => {
  mockDataStore.lastAgreementsResponse = null;
  mockDataStore.lastDashboardStatsResponse = null;
  mockDataStore.lastAgreementResponse = null;
};
