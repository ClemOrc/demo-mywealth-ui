import { gql } from '@apollo/client';

// Client Fragments
export const CLIENT_FRAGMENT = gql`
  fragment ClientFields on Client {
    id
    name
    email
    phone
    address
    dateOfBirth
    clientRoot
    iaCode
    residency
    language
    type
    status
  }
`;

export const CLIENT_MINIMAL_FRAGMENT = gql`
  fragment ClientMinimalFields on Client {
    id
    name
  }
`;

// Agreement Fragments
export const AGREEMENT_FRAGMENT = gql`
  fragment AgreementFields on Agreement {
    id
    agreementNumber
    clientName
    clientId
    agreementType
    status
    startDate
    endDate
    totalAmount
    currency
    description
    createdAt
    updatedAt
    createdBy
    modifiedBy
    advisorName
  }
`;

export const AGREEMENT_PRODUCT_FRAGMENT = gql`
  fragment AgreementProductFields on AgreementProduct {
    id
    productName
    productCode
    quantity
    unitPrice
    totalPrice
    description
  }
`;

export const AGREEMENT_TERM_FRAGMENT = gql`
  fragment AgreementTermFields on AgreementTerm {
    id
    termType
    value
    description
  }
`;

export const AGREEMENT_DOCUMENT_FRAGMENT = gql`
  fragment AgreementDocumentFields on AgreementDocument {
    id
    fileName
    fileType
    fileSize
    uploadedAt
    uploadedBy
    documentUrl
  }
`;

export const MODIFICATION_REQUEST_FRAGMENT = gql`
  fragment ModificationRequestFields on ModificationRequest {
    id
    agreementId
    requestType
    status
    requestedBy
    requestedAt
    approvedBy
    approvedAt
    rejectedBy
    rejectedAt
    rejectionReason
    comments
  }
`;

// Queries
export const GET_AGREEMENTS = gql`
  ${AGREEMENT_FRAGMENT}
  query GetAgreements(
    $filters: AgreementFiltersInput
    $pagination: PaginationInput
  ) {
    agreements(filters: $filters, pagination: $pagination) {
      data {
        ...AgreementFields
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const GET_AGREEMENT_BY_ID = gql`
  ${AGREEMENT_FRAGMENT}
  ${AGREEMENT_PRODUCT_FRAGMENT}
  ${AGREEMENT_TERM_FRAGMENT}
  ${AGREEMENT_DOCUMENT_FRAGMENT}
  query GetAgreementById($id: ID!) {
    agreement(id: $id) {
      ...AgreementFields
      products {
        ...AgreementProductFields
      }
      terms {
        ...AgreementTermFields
      }
      documents {
        ...AgreementDocumentFields
      }
    }
  }
`;

export const GET_CLIENTS = gql`
  ${CLIENT_FRAGMENT}
  query GetClients($searchTerm: String, $limit: Int = 50) {
    clients(searchTerm: $searchTerm, limit: $limit) {
      ...ClientFields
    }
  }
`;

// Optimized query for autocomplete - only fetches id and name
export const GET_CLIENTS_MINIMAL = gql`
  ${CLIENT_MINIMAL_FRAGMENT}
  query GetClientsMinimal($searchTerm: String, $limit: Int = 20) {
    clients(searchTerm: $searchTerm, limit: $limit) {
      ...ClientMinimalFields
    }
  }
`;

export const GET_CLIENT = gql`
  ${CLIENT_FRAGMENT}
  query GetClient($id: ID!) {
    client(id: $id) {
      ...ClientFields
    }
  }
`;

export const GET_CLIENT_ACCOUNTS = gql`
  query GetClientAccounts($clientId: ID!) {
    clientAccounts(clientId: $clientId) {
      id
      accountNumber
      accountType
      currency
      balance
      isEligible
      programType
    }
  }
`;

export const GET_HOUSEHOLD_MEMBERS = gql`
  query GetHouseholdMembers($clientId: ID!) {
    householdMembers(clientId: $clientId) {
      id
      name
      relation
      totalValue
      accounts {
        id
        accountNumber
        accountType
        balance
        currency
      }
    }
  }
`;

export const GET_ASSET_ALLOCATION_POLICIES = gql`
  query GetAssetAllocationPolicies {
    assetAllocationPolicies {
      id
      policyNumber
      fixedIncome
      canadianEquity
      globalEquity
      alternative
      code
    }
  }
`;

export const GET_PROGRAM_FEES = gql`
  query GetProgramFees($programType: String) {
    programFees(programType: $programType) {
      programType
      feeType
      feeSchedule
      minAmount
      billableAssets
      integrationPeriod
      purpose
      feeRates {
        tier
        rate
      }
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($category: String, $isActive: Boolean) {
    products(category: $category, isActive: $isActive) {
      id
      code
      name
      description
      category
      basePrice
      currency
      isActive
    }
  }
`;

export const GET_MODIFICATION_REQUESTS = gql`
  ${MODIFICATION_REQUEST_FRAGMENT}
  ${AGREEMENT_FRAGMENT}
  query GetModificationRequests(
    $filters: ModificationRequestFiltersInput
    $pagination: PaginationInput
  ) {
    modificationRequests(filters: $filters, pagination: $pagination) {
      data {
        ...ModificationRequestFields
        agreement {
          ...AgreementFields
        }
        changes {
          field
          oldValue
          newValue
          description
        }
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const GET_MODIFICATION_REQUEST_BY_ID = gql`
  ${MODIFICATION_REQUEST_FRAGMENT}
  ${AGREEMENT_FRAGMENT}
  query GetModificationRequestById($id: ID!) {
    modificationRequest(id: $id) {
      ...ModificationRequestFields
      agreement {
        ...AgreementFields
      }
      changes {
        field
        oldValue
        newValue
        description
      }
    }
  }
`;

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalAgreements
      activeAgreements
      pendingApprovals
      expiringSoon
      totalValue
      agreementsByStatus {
        status
        count
      }
      agreementsByType {
        type
        count
      }
      recentActivity {
        id
        type
        message
        timestamp
      }
    }
  }
`;
