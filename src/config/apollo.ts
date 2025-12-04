import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getMockConfig } from '../mocks/mockConfig';
import { MockLink } from '../mocks/MockLink';
import { setMockErrorConfig } from '../mocks/mockResolvers';

export const createApolloClient = (graphqlEndpoint: string) => {
  const mockConfig = getMockConfig();

  console.log('🔧 Apollo Config Debug:', {
    useMocks: mockConfig.useMocks,
    mockDelay: mockConfig.mockDelay,
    processEnv: typeof process !== 'undefined' ? process.env.REACT_APP_USE_MOCKS : 'process not defined'
  });

  // Use mock link if enabled
  if (mockConfig.useMocks) {
    console.log('🎭 Using Apollo Mock Link');
    console.log('Mock delay:', mockConfig.mockDelay, 'ms');
    
    // Configure error simulation
    setMockErrorConfig(mockConfig.errorConfig);

    const mockLink = new MockLink({
      delay: mockConfig.mockDelay,
    });

    return new ApolloClient({
      link: mockLink,
      cache: new InMemoryCache({
        dataIdFromObject: () => false, // Disable normalization completely
      }),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
        mutate: {
          errorPolicy: 'all',
        },
      },
    });
  }

  // Use real BFF endpoint
  console.log('🌐 Using Real BFF:', graphqlEndpoint);
  
  const httpLink = new HttpLink({
    uri: graphqlEndpoint,
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  return new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
};

// Default client for standalone mode
export const apolloClient = createApolloClient('http://localhost:8080/graphql');
