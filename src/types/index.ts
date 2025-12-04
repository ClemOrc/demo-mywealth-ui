// Agreement Types
export interface Agreement {
  id: string;
  agreementNumber: string;
  clientName: string;
  clientId: string;
  requestType?: string;
  agreementType: string;
  status: AgreementStatus;
  startDate: string;
  endDate?: string;
  totalAmount: number;
  currency: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  modifiedBy?: string;
  advisorName?: string;
  products?: AgreementProduct[];
  terms?: AgreementTerm[];
  documents?: AgreementDocument[];
  comments?: string;
  selectedAccounts?: string[]; // IDs of accounts selected for this agreement
  selectedPolicyId?: string; // ID of selected asset allocation policy
  // Client-related fields for display
  clientRoot?: string;
  iaCode?: string;
  feeGroup?: string;
}

export enum AgreementStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED',
  EXPIRED = 'EXPIRED',
}

export interface AgreementProduct {
  id: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
}

export interface AgreementTerm {
  id: string;
  termType: string;
  value: string;
  description?: string;
}

export interface AgreementDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  documentUrl: string;
}

// Modification Request Types
export interface ModificationRequest {
  id: string;
  agreementId: string;
  agreement: Agreement;
  requestType: ModificationRequestType;
  status: ModificationRequestStatus;
  requestedBy: string;
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  changes: ModificationChange[];
  comments?: string;
}

export enum ModificationRequestType {
  UPDATE = 'UPDATE',
  TERMINATION = 'TERMINATION',
  SUSPENSION = 'SUSPENSION',
  REACTIVATION = 'REACTIVATION',
}

export enum ModificationRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export interface ModificationChange {
  field: string;
  oldValue: string;
  newValue: string;
  description?: string;
}

// Form Types
export interface CreateAgreementFormValues {
  // Step 1: Basic Information
  agreementType: string;
  clientId: string;
  clientName: string;
  startDate: string;
  endDate?: string;
  
  // Step 2: Investing Account
  selectedAccounts: string[];
  
  // Step 3: Asset Allocation
  selectedPolicyId: string;
  
  // Step 4: Billing Details
  billingFrequency: string;
  billingStartDate: string;
  billingAccount: string;
  selectedHouseholdMembers: string[];
  
  // Step 5: Program Fees
  programType: string;
  feeType: string;
  currentFeeAccount: string;
  
  // Step 6: Products and Services
  products: AgreementProductInput[];
  
  // Step 7: Terms and Conditions
  terms: AgreementTermInput[];
  
  // Step 8: Documents
  documents: File[];
  
  // Step 9: Review and Submit
  comments?: string;
}

export interface AgreementProductInput {
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  description?: string;
}

export interface AgreementTermInput {
  termType: string;
  value: string;
  description?: string;
}

export interface ModifyAgreementFormValues {
  modificationType: ModificationRequestType;
  changes: Partial<Agreement>;
  reason: string;
  comments?: string;
}

// Filter and Search Types
export interface AgreementFilters {
  status?: AgreementStatus[];
  agreementType?: string[];
  clientName?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Client Types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  type: ClientType;
  status: string;
}

export enum ClientType {
  INDIVIDUAL = 'INDIVIDUAL',
  CORPORATE = 'CORPORATE',
}

// Product Types
export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
  basePrice: number;
  currency: string;
  isActive: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
}

export enum NotificationType {
  AGREEMENT_CREATED = 'AGREEMENT_CREATED',
  AGREEMENT_UPDATED = 'AGREEMENT_UPDATED',
  MODIFICATION_REQUESTED = 'MODIFICATION_REQUESTED',
  MODIFICATION_APPROVED = 'MODIFICATION_APPROVED',
  MODIFICATION_REJECTED = 'MODIFICATION_REJECTED',
  AGREEMENT_EXPIRING = 'AGREEMENT_EXPIRING',
}
