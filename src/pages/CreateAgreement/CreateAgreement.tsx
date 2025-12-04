import React from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_AGREEMENT } from '@graphql/mutations';
import { useAppContext } from '@contexts/AppContext';
import { useAppNavigation } from '../../hooks/useAppNavigation';
import { CreateAgreementFormValues, NotificationType } from '../../types';
import AgreementWizard from '@/components/AgreementWizard';

const CreateAgreement: React.FC = () => {
  const nav = useAppNavigation();
  const { addNotification } = useAppContext();
  const [createAgreement, { loading: submitting }] = useMutation(CREATE_AGREEMENT);

  const initialValues: CreateAgreementFormValues = {
    agreementType: '',
    clientId: '',
    clientName: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    selectedAccounts: [],
    selectedPolicyId: '',
    billingFrequency: '',
    billingStartDate: '',
    billingAccount: 'individual',
    selectedHouseholdMembers: [],
    programType: 'Premium Wealth Management',
    feeType: '',
    currentFeeAccount: 'yes',
    products: [],
    terms: [],
    documents: [],
    comments: '',
  };

  const handleSubmit = async (values: CreateAgreementFormValues) => {
    try {
      const { data } = await createAgreement({
        variables: {
          input: {
            agreementType: values.agreementType,
            clientId: values.clientId,
            startDate: values.startDate,
            endDate: values.endDate || null,
            products: values.products.map((p: any) => ({
              productCode: p.productCode,
              productName: p.productName,
              quantity: p.quantity,
              unitPrice: p.unitPrice,
            })),
            terms: values.terms.map((t: any) => ({
              termType: t.termType,
              value: t.value,
              description: t.description,
            })),
            documents: values.documents.map((d: File) => ({
              documentName: d.name,
              documentType: d.type,
              documentUrl: '',
            })),
            comments: values.comments,
          },
        },
      });

      addNotification({
        type: NotificationType.AGREEMENT_CREATED,
        message: `Agreement ${data.createAgreement.agreementNumber} created successfully`,
        severity: 'success',
      });

      nav.goToAgreementDetails(data.createAgreement.id);
    } catch (error) {
      addNotification({
        type: NotificationType.AGREEMENT_CREATED,
        message: `Failed to create agreement: ${error}`,
        severity: 'error',
      });
    }
  };

  return (
    <AgreementWizard
      title="Create a New Agreement"
      referenceNumber="277"
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={() => nav.goToDashboard()}
      submitButtonText="Submit Agreement"
      submitting={submitting}
    />
  );
};

export default CreateAgreement;
