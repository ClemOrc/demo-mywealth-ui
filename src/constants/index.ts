/**
 * Application-wide constants
 * Centralizes all hardcoded values for better maintainability
 */

// UI Display Constants
export const EMPTY_FIELD_PLACEHOLDER = '-';
export const DEFAULT_CURRENCY = 'CAD';
export const DEFAULT_PAGE_SIZE = 10;

// Route Constants
export const ROUTES = {
  ROOT: '/',
  DASHBOARD: '/dashboard',
  AGREEMENTS: '/agreements',
  CREATE_AGREEMENT: '/agreements/create',
  AGREEMENT_DETAILS: (id: string) => `/agreements/${id}`,
  MODIFY_AGREEMENT: (id: string) => `/agreements/${id}/modify`,
  PENDING_MODIFICATIONS: '/pending-modifications',
} as const;

// Agreement Status Constants
export const AGREEMENT_STATUS = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  ACTIVE: 'ACTIVE',
  TERMINATED: 'TERMINATED',
  EXPIRED: 'EXPIRED',
  SUSPENDED: 'SUSPENDED',
} as const;

export const AGREEMENT_STATUS_LABELS: Record<string, string> = {
  [AGREEMENT_STATUS.DRAFT]: 'Draft',
  [AGREEMENT_STATUS.PENDING_APPROVAL]: 'Pending Approval',
  [AGREEMENT_STATUS.ACTIVE]: 'Active',
  [AGREEMENT_STATUS.TERMINATED]: 'Terminated',
  [AGREEMENT_STATUS.EXPIRED]: 'Expired',
  [AGREEMENT_STATUS.SUSPENDED]: 'Suspended',
};

// Dashboard Tab Configuration
export const DASHBOARD_TABS = {
  PENDING: { value: 'PENDING_APPROVAL', label: 'Pending' },
  NEW: { value: 'NEW', label: 'New' },
  READY: { value: 'READY', label: 'Ready' },
  SENT: { value: 'SENT', label: 'Sent' },
  DELETED: { value: 'DELETED', label: 'Deleted' },
  DRAFTS: { value: 'DRAFT', label: 'Drafts' },
  ALL: { value: 'ALL', label: 'All' },
} as const;

// Theme Colors (reference these instead of hardcoding)
export const COLORS = {
  PRIMARY: '#1976d2',
  BACKGROUND_GRAY: '#f5f7fa',
  BACKGROUND_LIGHT: '#f5f9ff',
  BORDER_GRAY: '#e0e0e0',
  TEXT_SECONDARY: '#666',
  ERROR: '#d32f2f',
  SUCCESS: '#2e7d32',
  WARNING: '#ed6c02',
  WHITE: '#ffffff',
} as const;

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_PHONE: 'Invalid phone number',
  INVALID_DATE: 'Invalid date format',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be at most ${max} characters`,
} as const;

// API Configuration
export const API_CONFIG = {
  DEFAULT_GRAPHQL_ENDPOINT: 'http://localhost:8080/graphql',
  REQUEST_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// Date Format Constants
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  ISO: 'yyyy-MM-dd',
  FULL: 'MMMM dd, yyyy',
} as const;

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: '.pdf,.doc,.docx,.xls,.xlsx',
  ACCEPTED_MIME_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
} as const;

// Notification Types
export const NOTIFICATION_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Agreement Types
export const AGREEMENT_TYPES = [
  'Wealth Management',
  'Investment Advisory',
  'Portfolio Management',
  'Financial Planning',
  'Asset Management',
  'Discretionary Management',
  'Advisory Services',
] as const;

// Wizard Step Names
export const WIZARD_STEPS = [
  'Client Details',
  'Investing Account',
  'Asset Allocation',
  'Billing Details',
  'Program Fees',
  'Documents',
  'Notes',
  'Review',
] as const;
