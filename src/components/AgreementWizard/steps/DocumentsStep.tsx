import React from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { FormikProps } from 'formik';
import { CreateAgreementFormValues } from '../../../types';

type Props = FormikProps<CreateAgreementFormValues>;

const DocumentsStep: React.FC<Props> = ({ values, setFieldValue }) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newDocuments = [...values.documents, ...Array.from(files)];
      setFieldValue('documents', newDocuments);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newDocuments = values.documents.filter((_, i) => i !== index);
    setFieldValue('documents', newDocuments);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Documents (Optional)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload any supporting documents for this agreement. Supported formats: PDF, DOC, DOCX, XLS, XLSX
      </Typography>

      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          border: '2px dashed',
          borderColor: 'divider',
          backgroundColor: 'background.default',
          mb: 3,
        }}
      >
        <input
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          style={{ display: 'none' }}
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileSelect}
        />
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<UploadIcon />}
            size="large"
          >
            Upload Documents
          </Button>
        </label>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          or drag and drop files here
        </Typography>
      </Paper>

      {values.documents.length > 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Uploaded Documents ({values.documents.length})
          </Typography>
          <List>
            {values.documents.map((file, index) => (
              <ListItem
                key={index}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <FileIcon sx={{ mr: 2, color: 'primary.main' }} />
                <ListItemText
                  primary={file.name}
                  secondary={formatFileSize(file.size)}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default DocumentsStep;
