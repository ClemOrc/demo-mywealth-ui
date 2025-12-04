// Export all mock functionality for easy access
export { MockLink } from './MockLink';
export { mockResolvers, setMockErrorConfig } from './mockResolvers';
export {
  mockAgreements,
  mockClients,
  mockProducts,
  mockModificationRequests,
  mockAssetAllocationPolicies,
  mockAccounts,
  mockHouseholdMembers,
  mockProgramFees,
  mockDashboardStats,
} from './mockData';
export {
  getMockConfig,
  saveMockConfig,
  enableMocks,
  disableMocks,
  setMockDelay,
  enableMockErrors,
  disableMockErrors,
  setSpecificMockError,
  clearSpecificMockError,
} from './mockConfig';
export type { MockConfig } from './mockConfig';
export type { MockErrorConfig } from './mockResolvers';
