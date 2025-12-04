import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CreateAgreementFormValues } from '../../types';
import BasicInformationStep from './steps/BasicInformationStep';
import InvestingAccountStep from './steps/InvestingAccountStep';
import AssetAllocationStep from './steps/AssetAllocationStep';
import BillingDetailsStep from './steps/BillingDetailsStep';
import ProgramFeesStep from './steps/ProgramFeesStep';
import DocumentsStep from './steps/DocumentsStep';
import NotesStep from './steps/NotesStep';
import ReviewStep from './steps/ReviewStep';

const steps = [
  'Client Details',
  'Investing Account',
  'Asset Allocation Policies',
  'Billing Details',
  'Program Fees',
  'Documents',
  'Notes',
  'Review Summary',
];

const validationSchemas = [
  // Step 1: Client Details
  Yup.object({
    agreementType: Yup.string().required('Agreement type is required'),
    clientId: Yup.string().required('Client is required'),
    clientName: Yup.string().required('Client name is required'),
  }),
  // Step 2: Investing Account (optional for now)
  Yup.object({}),
  // Step 3: Asset Allocation Policies (optional)
  Yup.object({}),
  // Step 4: Billing Details (optional)
  Yup.object({}),
  // Step 5: Program Fees (optional)
  Yup.object({}),
  // Step 6: Documents (optional)
  Yup.object({}),
  // Step 7: Notes (optional)
  Yup.object({}),
  // Step 8: Review Summary
  Yup.object({}),
];

interface AgreementWizardProps {
  title: string;
  referenceNumber: string;
  initialValues: CreateAgreementFormValues;
  onSubmit: (values: CreateAgreementFormValues, formikBag?: any) => Promise<void>;
  onCancel: () => void;
  submitButtonText?: string;
  submitting?: boolean;
}

const AgreementWizard: React.FC<AgreementWizardProps> = ({
  title,
  referenceNumber,
  initialValues,
  onSubmit,
  onCancel,
  submitButtonText = 'Submit Agreement',
  submitting = false,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const currentValidationSchema = validationSchemas[activeStep];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (values: CreateAgreementFormValues, formikBag?: any) => {
    // Prevent submission if not on the final step
    if (activeStep !== steps.length - 1) {
      if (formikBag) {
        formikBag.setSubmitting(false);
      }
      return;
    }

    await onSubmit(values, formikBag);
  };

  const getStepContent = (step: number, formikProps: any) => {
    switch (step) {
      case 0:
        return <BasicInformationStep {...formikProps} />;
      case 1:
        return <InvestingAccountStep {...formikProps} />;
      case 2:
        return <AssetAllocationStep {...formikProps} />;
      case 3:
        return <BillingDetailsStep {...formikProps} />;
      case 4:
        return <ProgramFeesStep {...formikProps} />;
      case 5:
        return <DocumentsStep {...formikProps} />;
      case 6:
        return <NotesStep {...formikProps} />;
      case 7:
        return <ReviewStep {...formikProps} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Reference N° {referenceNumber}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Left Sidebar */}
        <Paper sx={{ width: 280, p: 3, height: 'fit-content' }}>
          {/* User Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: '#1976d2',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                mr: 2,
              }}
            >
              JT
            </Box>
            <Typography variant="body2">Jean-François Tremblay</Typography>
          </Box>

          {/* Create/Modify item */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem' }}>
              {title.includes('Modify') ? 'Modify an item' : 'Create an item'}
            </Typography>
            <Box
              sx={{
                bgcolor: '#f5f5f5',
                p: 2,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box sx={{ fontSize: '2rem' }}>🌱</Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Request N°
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  GEUZGHPX
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Steps Navigation */}
          <Box>
            {steps.map((step, index) => (
              <Box
                key={step}
                onClick={() => setActiveStep(index)}
                sx={{
                  py: 1.5,
                  cursor: 'pointer',
                  color: activeStep === index ? '#1976d2' : 'text.primary',
                  fontWeight: activeStep === index ? 600 : 400,
                  borderLeft: activeStep === index ? '3px solid #1976d2' : '3px solid transparent',
                  pl: 2,
                  ml: -3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  '&:hover': { bgcolor: '#f5f5f5' },
                }}
              >
                <Typography variant="body2">{step}</Typography>
                {index < activeStep && (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: '#4caf50',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                    }}
                  >
                    ✓
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 4 }}>
            <Formik
              initialValues={initialValues}
              validationSchema={currentValidationSchema}
              onSubmit={(values, formikBag) => {
                // No-op: submission is handled manually via button click
                formikBag.setSubmitting(false);
              }}
              validateOnChange={true}
              validateOnBlur={true}
              enableReinitialize={true}
            >
              {(formikProps) => (
                <Form
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && activeStep !== steps.length - 1) {
                      e.preventDefault();
                    }
                  }}
                >
                  {getStepContent(activeStep, formikProps)}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={onCancel}
                      sx={{ textTransform: 'none' }}
                    >
                      Cancel
                    </Button>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        type="button"
                        variant="text"
                        sx={{ textTransform: 'none', color: '#1976d2' }}
                      >
                        Save Draft
                      </Button>
                      <Button
                        type="button"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        variant="outlined"
                        sx={{ textTransform: 'none' }}
                      >
                        Back
                      </Button>
                      {activeStep === steps.length - 1 ? (
                        <Button
                          type="button"
                          variant="contained"
                          disabled={submitting || !formikProps.isValid}
                          onClick={async () => {
                            await handleSubmit(formikProps.values, formikProps);
                          }}
                          sx={{ textTransform: 'none' }}
                        >
                          {submitting ? 'Submitting...' : submitButtonText}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="contained"
                          onClick={async () => {
                            const errors = await formikProps.validateForm();
                            if (Object.keys(errors).length === 0) {
                              handleNext();
                            } else {
                              formikProps.setTouched(
                                Object.keys(errors).reduce((accumulator, key) => ({ ...accumulator, [key]: true }), {})
                              );
                            }
                          }}
                          sx={{ textTransform: 'none' }}
                        >
                          Continue
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AgreementWizard;
