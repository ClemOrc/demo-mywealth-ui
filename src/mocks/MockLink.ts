import { ApolloLink, Observable, FetchResult, Operation } from '@apollo/client';
import { print } from 'graphql';
import { mockResolvers } from './mockResolvers';
import {
  setMockAgreements,
  setMockDashboardStats,
  setMockAgreement,
  setMockClients,
  setMockClient,
  setMockClientAccounts,
  setMockHouseholdMembers,
  setMockProducts,
  setMockAssetAllocationPolicies,
  setMockProgramFees,
  setMockModificationRequests,
  setMockModificationRequest,
} from './mockStore';

interface MockLinkOptions {
  delay?: number; // Delay in milliseconds (0 for immediate response)
}

export class MockLink extends ApolloLink {
  private delay: number;

  constructor(options: MockLinkOptions = {}) {
    super();
    this.delay = options.delay || 0;
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((observer) => {
      const executeOperation = async () => {
        try {
          // Add delay if configured
          if (this.delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, this.delay));
          }

          const { operationName, query, variables } = operation;
          
          // Parse the operation to determine if it's a query or mutation
          const queryString = print(query);
          const isQuery = queryString.includes('query');
          const isMutation = queryString.includes('mutation');

          // Extract the actual operation name from the query
          const actualOperationName = this.extractOperationName(queryString, operationName);

          let result: any;

          if (isQuery && (mockResolvers.Query as any)[actualOperationName]) {
            result = await (mockResolvers.Query as any)[actualOperationName](
              null,
              variables,
              null,
              null
            );
          } else if (isMutation && (mockResolvers.Mutation as any)[actualOperationName]) {
            result = await (mockResolvers.Mutation as any)[actualOperationName](
              null,
              variables,
              null,
              null
            );
          } else {
            throw new Error(`Mock resolver not found for operation: ${actualOperationName}`);
          }

          // Store raw data in global store before Apollo processes it
          const storeFunctions: { [key: string]: (data: any) => void } = {
            agreements: setMockAgreements,
            dashboardStats: setMockDashboardStats,
            agreement: setMockAgreement,
            clients: setMockClients,
            client: setMockClient,
            clientAccounts: setMockClientAccounts,
            householdMembers: setMockHouseholdMembers,
            products: setMockProducts,
            assetAllocationPolicies: setMockAssetAllocationPolicies,
            programFees: setMockProgramFees,
            modificationRequests: setMockModificationRequests,
            modificationRequest: setMockModificationRequest,
          };

          if (storeFunctions[actualOperationName]) {
            storeFunctions[actualOperationName](result);
            console.log(`📦 Stored in mockStore[${actualOperationName}]:`, result);
          }

          // IMPORTANT: Return raw data without Apollo processing
          // This bypasses Apollo's field filtering
          const rawResponse: any = {
            [actualOperationName]: result,
          };

          console.log('🎭 Sending raw response to Apollo:', { operation: actualOperationName, hasData: !!result });

          // Send as raw data - Apollo will use it directly
          observer.next({ data: rawResponse } as FetchResult);
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      };

      executeOperation();
    });
  }

  private extractOperationName(queryString: string, fallbackName: string | undefined): string {
    // First try to extract the actual GraphQL field name from the query
    // Matches patterns like: { agreement(id: $id) or { agreements(filters:
    const fieldMatch = queryString.match(/\{\s*(\w+)\s*[\(:{]/);
    if (fieldMatch && fieldMatch[1]) {
      // Skip common wrapper fields like 'query' or 'mutation'
      const fieldName = fieldMatch[1];
      if (fieldName !== 'query' && fieldName !== 'mutation') {
        return fieldName;
      }
    }

    // Fallback: Try to extract operation name from query declaration
    // Matches patterns like: query GetAgreements or mutation CreateAgreement
    const match = queryString.match(/(?:query|mutation)\s+(\w+)/);
    if (match && match[1]) {
      const operationName = match[1];
      
      // Remove common prefixes (Get, Create, Update, Delete, List) for camelCase conversion
      let resolverName = operationName;
      
      // Handle Get prefix (GetAgreements -> agreements, GetDashboardStats -> dashboardStats)
      if (resolverName.startsWith('Get')) {
        resolverName = resolverName.substring(3);
      } else if (resolverName.startsWith('Create')) {
        resolverName = resolverName.substring(6);
      } else if (resolverName.startsWith('Update')) {
        resolverName = resolverName.substring(6);
      } else if (resolverName.startsWith('Delete')) {
        resolverName = resolverName.substring(6);
      } else if (resolverName.startsWith('List')) {
        resolverName = resolverName.substring(4);
      }
      
      // Convert to camelCase (first letter lowercase)
      return resolverName.charAt(0).toLowerCase() + resolverName.slice(1);
    }

    // Fall back to the operation name provided
    if (fallbackName) {
      return fallbackName;
    }

    throw new Error('Could not determine operation name from query');
  }
}
