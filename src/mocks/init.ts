/**
 * Initialize mocks on app startup
 * This runs before Apollo client is created
 */

// Check if we're in development and initialize mocks by default
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  // Check localStorage first
  const stored = typeof window !== 'undefined' && window.localStorage 
    ? localStorage.getItem('mockConfig') 
    : null;

  // If nothing in localStorage and we're in development, enable mocks
  if (!stored && typeof window !== 'undefined') {
    const mockConfig = {
      useMocks: true,
      mockDelay: 0,
      errorConfig: {
        enabled: false,
        errorRate: 0,
        specificErrors: {}
      }
    };
    
    localStorage.setItem('mockConfig', JSON.stringify(mockConfig));
    console.log('🎭 Development mode detected - mocks enabled by default');
    console.log('Mock config initialized:', mockConfig);
  }
}
