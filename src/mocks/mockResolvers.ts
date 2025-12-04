import { GraphQLError } from 'graphql';
import {
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
import {
  Agreement,
  AgreementStatus,
  ModificationRequest,
  ModificationRequestStatus,
  PaginatedResponse,
} from '../types';
import { clearAgreementsCache } from './mockStore';

// Mock error configuration
export interface MockErrorConfig {
  enabled: boolean;
  errorRate: number; // 0-1, percentage of requests that should fail
  specificErrors?: {
    [operation: string]: string; // operation name -> error message
  };
}

let mockErrorConfig: MockErrorConfig = {
  enabled: false,
  errorRate: 0,
  specificErrors: {},
};

export const setMockErrorConfig = (config: Partial<MockErrorConfig>) => {
  mockErrorConfig = { ...mockErrorConfig, ...config };
};

// Helper to simulate errors
const maybeThrowError = (operationName: string) => {
  if (!mockErrorConfig.enabled) return;

  // Check for specific error
  if (mockErrorConfig.specificErrors?.[operationName]) {
    throw new GraphQLError(mockErrorConfig.specificErrors[operationName], {
      extensions: { code: 'MOCK_ERROR' },
    });
  }

  // Random error based on error rate
  if (Math.random() < mockErrorConfig.errorRate) {
    throw new GraphQLError(`Simulated error for ${operationName}`, {
      extensions: { code: 'MOCK_ERROR' },
    });
  }
};

// Helper function to paginate results
const paginate = <T>(
  data: T[],
  page: number = 1,
  pageSize: number = 10
): PaginatedResponse<T> => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = data.slice(start, end);

  return {
    data: paginatedData,
    total: data.length,
    page,
    pageSize,
    totalPages: Math.ceil(data.length / pageSize),
  };
};

// Helper to generate new IDs
let agreementCounter = 13;
let modificationRequestCounter = 4;
let productCounter = 100;
let termCounter = 100;
let documentCounter = 100;

const generateAgreementNumber = () => `WM-2024-${String(agreementCounter++).padStart(3, '0')}`;
const generateId = (prefix: string, counter: number) => `${prefix}${String(counter).padStart(3, '0')}`;

// Mock resolvers
export const mockResolvers = {
  Query: {
    agreements: (_: any, { filters, pagination }: any) => {
      maybeThrowError('agreements');

      let filteredAgreements = [...mockAgreements];

      // Apply filters
      if (filters) {
        if (filters.status && filters.status.length > 0) {
          filteredAgreements = filteredAgreements.filter((a) =>
            filters.status.includes(a.status)
          );
        }

        if (filters.agreementType && filters.agreementType.length > 0) {
          filteredAgreements = filteredAgreements.filter((a) =>
            filters.agreementType.includes(a.agreementType)
          );
        }

        if (filters.clientName) {
          const searchTerm = filters.clientName.toLowerCase();
          filteredAgreements = filteredAgreements.filter((a) =>
            a.clientName.toLowerCase().includes(searchTerm)
          );
        }

        if (filters.searchTerm) {
          const searchTerm = filters.searchTerm.toLowerCase();
          filteredAgreements = filteredAgreements.filter(
            (a) =>
              a.agreementNumber.toLowerCase().includes(searchTerm) ||
              a.clientName.toLowerCase().includes(searchTerm) ||
              a.description?.toLowerCase().includes(searchTerm)
          );
        }

        if (filters.dateFrom) {
          filteredAgreements = filteredAgreements.filter(
            (a) => new Date(a.startDate) >= new Date(filters.dateFrom)
          );
        }

        if (filters.dateTo) {
          filteredAgreements = filteredAgreements.filter(
            (a) => new Date(a.startDate) <= new Date(filters.dateTo)
          );
        }
      }

      // Apply sorting
      if (pagination?.sortBy) {
        const sortField = pagination.sortBy as keyof Agreement;
        const sortOrder = pagination.sortOrder === 'desc' ? -1 : 1;

        filteredAgreements.sort((a, b) => {
          const aVal = a[sortField];
          const bVal = b[sortField];
          if (aVal === undefined || bVal === undefined) return 0;
          if (aVal < bVal) return -1 * sortOrder;
          if (aVal > bVal) return 1 * sortOrder;
          return 0;
        });
      } else {
        // Default sort by createdAt desc
        filteredAgreements.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      // Add __typename to each agreement for Apollo cache
      const agreementsWithTypename = filteredAgreements.map(a => ({
        ...a,
      }));

      // Apply pagination
      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      const result = paginate(agreementsWithTypename, page, pageSize);
      
      return result;
    },

    agreement: (_: any, { id }: { id: string }) => {
      maybeThrowError('agreement');
      const agreement = mockAgreements.find((a) => a.id === id);
      if (!agreement) {
        throw new GraphQLError(`Agreement with id ${id} not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return agreement;
    },

    clients: (_: any, { searchTerm, limit = 50 }: any) => {
      maybeThrowError('clients');
      let filtered = [...mockClients];

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(term) ||
            c.email.toLowerCase().includes(term)
        );
      }

      return filtered.slice(0, limit);
    },

    client: (_: any, { id }: { id: string }) => {
      maybeThrowError('client');
      const client = mockClients.find((c) => c.id === id);
      if (!client) {
        throw new GraphQLError(`Client with id ${id} not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return client;
    },

    clientAccounts: (_: any, { clientId }: { clientId: string }) => {
      maybeThrowError('clientAccounts');
      console.log('Fetching accounts for client:', clientId);
      const filteredAccounts = mockAccounts.filter((account: any) => account.clientId === clientId);
      console.log(`Found ${filteredAccounts.length} accounts for client ${clientId}`);
      return filteredAccounts;
    },

    householdMembers: (_: any, { clientId }: { clientId: string }) => {
      maybeThrowError('householdMembers');
      console.log('Fetching household members for client:', clientId);
      const filteredMembers = mockHouseholdMembers.filter((member: any) => member.clientId === clientId);
      console.log(`Found ${filteredMembers.length} household members for client ${clientId}`);
      return filteredMembers;
    },

    products: (_: any, { category, isActive }: any) => {
      maybeThrowError('products');
      let filtered = [...mockProducts];

      if (category) {
        filtered = filtered.filter((p) => p.category === category);
      }

      if (isActive !== undefined) {
        filtered = filtered.filter((p) => p.isActive === isActive);
      }

      return filtered;
    },

    assetAllocationPolicies: () => {
      maybeThrowError('assetAllocationPolicies');
      return mockAssetAllocationPolicies;
    },

    programFees: (_: any, { programType }: any) => {
      maybeThrowError('programFees');
      // Return the same fees for all program types in mock
      // In real scenario, would filter by programType
      console.log('Fetching program fees for type:', programType);
      return mockProgramFees;
    },

    modificationRequests: (_: any, { filters, pagination }: any) => {
      maybeThrowError('modificationRequests');
      let filtered = [...mockModificationRequests];

      if (filters?.status && filters.status.length > 0) {
        filtered = filtered.filter((mr) => filters.status.includes(mr.status));
      }

      const page = pagination?.page || 1;
      const pageSize = pagination?.pageSize || 10;
      return paginate(filtered, page, pageSize);
    },

    modificationRequest: (_: any, { id }: { id: string }) => {
      maybeThrowError('modificationRequest');
      const request = mockModificationRequests.find((mr) => mr.id === id);
      if (!request) {
        throw new GraphQLError(`Modification request with id ${id} not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return request;
    },

    dashboardStats: () => {
      maybeThrowError('dashboardStats');
      // Recalculate stats based on current mock data
      return {
        totalAgreements: mockAgreements.length,
        activeAgreements: mockAgreements.filter(
          (a) => a.status === AgreementStatus.ACTIVE
        ).length,
        pendingApprovals: mockAgreements.filter(
          (a) => a.status === AgreementStatus.PENDING_APPROVAL
        ).length,
        draftAgreements: mockAgreements.filter(
          (a) => a.status === AgreementStatus.DRAFT
        ).length,
        expiredAgreements: mockAgreements.filter(
          (a) => a.status === AgreementStatus.EXPIRED
        ).length,
        terminatedAgreements: mockAgreements.filter(
          (a) => a.status === AgreementStatus.TERMINATED
        ).length,
        pendingApprovalAgreements: mockAgreements.filter(
          (a) => a.status === AgreementStatus.PENDING_APPROVAL
        ).length,
        expiringSoon: mockDashboardStats.expiringSoon,
        totalValue: mockAgreements.reduce((sum, a) => sum + a.totalAmount, 0),
        agreementsByStatus: mockDashboardStats.agreementsByStatus,
        agreementsByType: mockDashboardStats.agreementsByType,
        recentActivity: [],
      };
    },
  },

  Mutation: {
    createAgreement: (_: any, { input }: any) => {
      maybeThrowError('createAgreement');

      const client = mockClients.find((c) => c.id === input.clientId);
      if (!client) {
        throw new GraphQLError(`Client with id ${input.clientId} not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const newAgreement: Agreement = {
        id: generateId('AGR', agreementCounter),
        agreementNumber: generateAgreementNumber(),
        clientName: client.name,
        clientId: input.clientId,
        agreementType: input.agreementType,
        status: AgreementStatus.DRAFT,
        startDate: input.startDate,
        endDate: input.endDate,
        totalAmount: input.products.reduce(
          (sum: number, p: any) => sum + p.unitPrice * p.quantity,
          0
        ),
        currency: 'CAD',
        description: input.comments || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'current.user@mywealth.com',
        advisorName: 'Current User',
        products: input.products.map((p: any) => ({
          id: generateId('AP', productCounter++),
          productName: p.productName,
          productCode: p.productCode,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
          totalPrice: p.unitPrice * p.quantity,
          description: p.description,
        })),
        terms: input.terms.map((t: any) => ({
          id: generateId('AT', termCounter++),
          termType: t.termType,
          value: t.value,
          description: t.description,
        })),
        documents: [],
      };

      mockAgreements.push(newAgreement);
      
      // Clear cache so queries refetch fresh data
      clearAgreementsCache();
      
      return newAgreement;
    },

    updateAgreement: (_: any, { id, input }: any) => {
      maybeThrowError('updateAgreement');

      const agreementIndex = mockAgreements.findIndex((a) => a.id === id);
      if (agreementIndex === -1) {
        throw new GraphQLError(`Agreement with id ${id} not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const updatedAgreement = {
        ...mockAgreements[agreementIndex],
        ...input,
        updatedAt: new Date().toISOString(),
        modifiedBy: 'current.user@mywealth.com',
      };

      mockAgreements[agreementIndex] = updatedAgreement;
      
      // Clear cache so queries refetch fresh data
      clearAgreementsCache();
      
      return updatedAgreement;
    },

    deleteAgreement: (_: any, { id }: { id: string }) => {
      maybeThrowError('deleteAgreement');

      const agreementIndex = mockAgreements.findIndex((a) => a.id === id);
      if (agreementIndex === -1) {
        throw new GraphQLError(`Agreement with id ${id} not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      mockAgreements.splice(agreementIndex, 1);
      return {
        success: true,
        message: 'Agreement deleted successfully',
      };
    },

    createModificationRequest: (_: any, { input }: any) => {
      maybeThrowError('createModificationRequest');

      const agreement = mockAgreements.find((a) => a.id === input.agreementId);
      if (!agreement) {
        throw new GraphQLError(
          `Agreement with id ${input.agreementId} not found`,
          { extensions: { code: 'NOT_FOUND' } }
        );
      }

      const newRequest: ModificationRequest = {
        id: generateId('MR', modificationRequestCounter++),
        agreementId: input.agreementId,
        agreement,
        requestType: input.requestType,
        status: ModificationRequestStatus.PENDING,
        requestedBy: 'current.user@mywealth.com',
        requestedAt: new Date().toISOString(),
        comments: input.comments,
        changes: input.changes,
      };

      mockModificationRequests.push(newRequest);
      return newRequest;
    },

    approveModificationRequest: (_: any, { id, comments }: any) => {
      maybeThrowError('approveModificationRequest');

      const requestIndex = mockModificationRequests.findIndex(
        (mr) => mr.id === id
      );
      if (requestIndex === -1) {
        throw new GraphQLError(`Modification request with id ${id} not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const request = mockModificationRequests[requestIndex];
      const updatedRequest = {
        ...request,
        status: ModificationRequestStatus.APPROVED,
        approvedBy: 'manager@mywealth.com',
        approvedAt: new Date().toISOString(),
        comments: comments || request.comments,
      };

      mockModificationRequests[requestIndex] = updatedRequest;

      // Apply changes to the agreement
      const agreementIndex = mockAgreements.findIndex(
        (a) => a.id === updatedRequest.agreementId
      );
      if (agreementIndex !== -1) {
        const agreement = mockAgreements[agreementIndex];
        
        // Apply each change from the modification request
        updatedRequest.changes?.forEach((change) => {
          try {
            // Handle different field types
            if (change.field === 'status') {
              (agreement as any).status = change.newValue;
            } else if (change.field === 'products' && change.newValue) {
              // Handle products update - in real app would merge/update products
              (agreement as any).products = change.newValue;
            } else if (change.field && change.newValue !== undefined) {
              // Generic field update
              (agreement as any)[change.field] = change.newValue;
            }
          } catch (e) {
            console.error(`Failed to apply change to field ${change.field}:`, e);
          }
        });
        
        // Update modification metadata
        agreement.updatedAt = new Date().toISOString();
        agreement.modifiedBy = 'manager@mywealth.com';
        
        mockAgreements[agreementIndex] = { ...agreement };
        
        // Clear cache so queries refetch fresh data
        clearAgreementsCache();
      }

      return updatedRequest;
    },

    rejectModificationRequest: (_: any, { id, reason }: any) => {
      maybeThrowError('rejectModificationRequest');

      const requestIndex = mockModificationRequests.findIndex(
        (mr) => mr.id === id
      );
      if (requestIndex === -1) {
        throw new GraphQLError(`Modification request with id ${id} not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const updatedRequest = {
        ...mockModificationRequests[requestIndex],
        status: ModificationRequestStatus.REJECTED,
        rejectedBy: 'manager@mywealth.com',
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason,
      };

      mockModificationRequests[requestIndex] = updatedRequest;
      return updatedRequest;
    },

    cancelModificationRequest: (_: any, { id }: { id: string }) => {
      maybeThrowError('cancelModificationRequest');

      const requestIndex = mockModificationRequests.findIndex(
        (mr) => mr.id === id
      );
      if (requestIndex === -1) {
        throw new GraphQLError(`Modification request with id ${id} not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const updatedRequest = {
        ...mockModificationRequests[requestIndex],
        status: ModificationRequestStatus.CANCELLED,
      };

      mockModificationRequests[requestIndex] = updatedRequest;
      return updatedRequest;
    },

    uploadDocument: (_: any, { agreementId, file }: any) => {
      maybeThrowError('uploadDocument');

      const agreement = mockAgreements.find((a) => a.id === agreementId);
      if (!agreement) {
        throw new GraphQLError(`Agreement with id ${agreementId} not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const newDocument = {
        id: generateId('DOC', documentCounter++),
        fileName: file.name || 'document.pdf',
        fileType: 'application/pdf',
        fileSize: file.size || 1024,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'current.user@mywealth.com',
        documentUrl: `/documents/${agreementId}/${file.name}`,
      };

      if (!agreement.documents) {
        agreement.documents = [];
      }
      agreement.documents.push(newDocument);

      return newDocument;
    },

    deleteDocument: (_: any, { documentId }: { documentId: string }) => {
      maybeThrowError('deleteDocument');

      // Find and remove document from all agreements
      let found = false;
      for (const agreement of mockAgreements) {
        if (agreement.documents) {
          const docIndex = agreement.documents.findIndex(
            (d) => d.id === documentId
          );
          if (docIndex !== -1) {
            agreement.documents.splice(docIndex, 1);
            found = true;
            break;
          }
        }
      }

      if (!found) {
        throw new GraphQLError(`Document with id ${documentId} not found`, {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return {
        success: true,
        message: 'Document deleted successfully',
      };
    },
  },
};
