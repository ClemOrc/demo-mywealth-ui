import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { APPROVE_AGREEMENT, DECLINE_AGREEMENT } from '../graphql/mutations';
import { AgreementStatus } from '../types';

export interface UseAgreementActionsResult {
  approveAgreement: (agreementId: string) => Promise<void>;
  declineAgreement: (agreementId: string) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export const useAgreementActions = (): UseAgreementActionsResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [approveAgreementMutation] = useMutation(APPROVE_AGREEMENT);
  const [declineAgreementMutation] = useMutation(DECLINE_AGREEMENT);

  const approveAgreement = async (agreementId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await approveAgreementMutation({
        variables: { id: agreementId },
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const declineAgreement = async (agreementId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await declineAgreementMutation({
        variables: { id: agreementId },
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    approveAgreement,
    declineAgreement,
    loading,
    error,
  };
};