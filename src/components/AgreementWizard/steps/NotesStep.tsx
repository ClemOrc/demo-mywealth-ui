import React from 'react';
import {
  Box,
  Typography,
  TextField,
} from '@mui/material';
import { FormikProps } from 'formik';
import { CreateAgreementFormValues } from '../../../types';

type Props = FormikProps<CreateAgreementFormValues>;

const NotesStep: React.FC<Props> = ({ values, setFieldValue }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Notes
      </Typography>

      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Enter your notes
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={6}
        placeholder="300 characters max"
        inputProps={{ maxLength: 300 }}
        value={values.comments || ''}
        onChange={(e) => setFieldValue('comments', e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
          }
        }}
      />
    </Box>
  );
};

export default NotesStep;
