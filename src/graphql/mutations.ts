import { gql } from '@apollo/client';
import { AGREEMENT_FRAGMENT, MODIFICATION_REQUEST_FRAGMENT } from './queries';

// Mutations
export const CREATE_AGREEMENT = gql`
  ${AGREEMENT_FRAGMENT}
  mutation CreateAgreement($input: CreateAgreementInput!) {
    createAgreement(input: $input) {
      ...AgreementFields
    }
  }
`;

export const UPDATE_AGREEMENT = gql`
  ${AGREEMENT_FRAGMENT}
  mutation UpdateAgreement($id: ID!, $input: UpdateAgreementInput!) {
    updateAgreement(id: $id, input: $input) {
      ...AgreementFields
    }
  }
`;

export const DELETE_AGREEMENT = gql`
  mutation DeleteAgreement($id: ID!) {
    deleteAgreement(id: $id) {
      success
      message
    }
  }
`;

export const CREATE_MODIFICATION_REQUEST = gql`
  ${MODIFICATION_REQUEST_FRAGMENT}
  mutation CreateModificationRequest($input: CreateModificationRequestInput!) {
    createModificationRequest(input: $input) {
      ...ModificationRequestFields
    }
  }
`;

export const APPROVE_MODIFICATION_REQUEST = gql`
  ${MODIFICATION_REQUEST_FRAGMENT}
  mutation ApproveModificationRequest($id: ID!, $comments: String) {
    approveModificationRequest(id: $id, comments: $comments) {
      ...ModificationRequestFields
    }
  }
`;

export const REJECT_MODIFICATION_REQUEST = gql`
  ${MODIFICATION_REQUEST_FRAGMENT}
  mutation RejectModificationRequest($id: ID!, $reason: String!) {
    rejectModificationRequest(id: $id, reason: $reason) {
      ...ModificationRequestFields
    }
  }
`;

export const CANCEL_MODIFICATION_REQUEST = gql`
  ${MODIFICATION_REQUEST_FRAGMENT}
  mutation CancelModificationRequest($id: ID!) {
    cancelModificationRequest(id: $id) {
      ...ModificationRequestFields
    }
  }
`;

export const UPLOAD_DOCUMENT = gql`
  mutation UploadDocument($agreementId: ID!, $file: Upload!) {
    uploadDocument(agreementId: $agreementId, file: $file) {
      id
      fileName
      fileType
      fileSize
      uploadedAt
      uploadedBy
      documentUrl
    }
  }
`;

export const DELETE_DOCUMENT = gql`
  mutation DeleteDocument($documentId: ID!) {
    deleteDocument(documentId: $documentId) {
      success
      message
    }
  }
`;
