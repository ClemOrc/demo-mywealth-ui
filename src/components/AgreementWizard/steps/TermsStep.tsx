import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { FieldArray, FormikProps } from 'formik';
import { CreateAgreementFormValues, AgreementTermInput } from '../../../types';
import { EMPTY_FIELD_PLACEHOLDER } from '../../../constants';

type Props = FormikProps<CreateAgreementFormValues>;

const termTypes = [
  'Payment Terms',
  'Service Level Agreement',
  'Confidentiality',
  'Termination Clause',
  'Renewal Terms',
  'Fee Structure',
  'Performance Benchmark',
  'Reporting Frequency',
  'Review Period',
  'Dispute Resolution',
];

const TermsStep: React.FC<Props> = ({ values, setFieldValue, errors, touched }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentTerm, setCurrentTerm] = useState<AgreementTermInput>({
    termType: '',
    value: '',
    description: '',
  });

  const handleOpenDialog = (index?: number) => {
    if (index !== undefined) {
      setEditIndex(index);
      setCurrentTerm(values.terms[index]);
    } else {
      setEditIndex(null);
      setCurrentTerm({
        termType: '',
        value: '',
        description: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditIndex(null);
  };

  const handleSaveTerm = () => {
    const newTerms = [...values.terms];
    if (editIndex !== null) {
      newTerms[editIndex] = currentTerm;
    } else {
      newTerms.push(currentTerm);
    }
    setFieldValue('terms', newTerms);
    handleCloseDialog();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Terms & Conditions</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Term
        </Button>
      </Box>

      {values.terms.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            No terms added yet. Click "Add Term" to get started.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Term Type</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <FieldArray name="terms">
                {({ remove }) => (
                  <>
                    {values.terms.map((term, index) => (
                      <TableRow key={index}>
                        <TableCell>{term.termType}</TableCell>
                        <TableCell>{term.value}</TableCell>
                        <TableCell>{term.description || EMPTY_FIELD_PLACEHOLDER}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(index)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => remove(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </FieldArray>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Term Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editIndex !== null ? 'Edit Term' : 'Add Term'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Term Type"
                value={currentTerm.termType}
                onChange={(e) =>
                  setCurrentTerm({
                    ...currentTerm,
                    termType: e.target.value,
                  })
                }
                required
              >
                {termTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Value"
                value={currentTerm.value}
                onChange={(e) =>
                  setCurrentTerm({
                    ...currentTerm,
                    value: e.target.value,
                  })
                }
                required
                helperText="e.g., 'Net 30 days', 'Quarterly', '95% uptime', etc."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={currentTerm.description || ''}
                onChange={(e) =>
                  setCurrentTerm({
                    ...currentTerm,
                    description: e.target.value,
                  })
                }
                helperText="Optional: Provide additional details about this term"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveTerm}
            variant="contained"
            disabled={!currentTerm.termType || !currentTerm.value}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {touched.terms && errors.terms && typeof errors.terms === 'string' && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {errors.terms}
        </Typography>
      )}
    </Box>
  );
};

export default TermsStep;
