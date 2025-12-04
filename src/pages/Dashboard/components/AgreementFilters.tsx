import React, { useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Link,
} from '@mui/material';
import { AgreementFilters as FilterType, AgreementStatus } from '../../../types';

interface AgreementFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onRefresh: () => void;
}

const agreementTypes = [
  'Wealth Management',
  'Investment Advisory',
  'Portfolio Management',
  'Financial Planning',
  'Asset Management',
];

const AgreementFilters: React.FC<AgreementFiltersProps> = ({
  filters,
  onFiltersChange,
  onRefresh,
}) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, searchTerm: event.target.value });
  };

  const handleClientNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, clientName: event.target.value });
  };

  const handleStatusChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onFiltersChange({
      ...filters,
      status: typeof value === 'string' ? [value as AgreementStatus] : (value as AgreementStatus[]),
    });
  };

  const handleTypeChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onFiltersChange({
      ...filters,
      agreementType: typeof value === 'string' ? [value] : value,
    });
  };

  const handleDateFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, dateFrom: event.target.value });
  };

  const handleDateToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, dateTo: event.target.value });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      status: undefined,
      agreementType: undefined,
      clientName: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      searchTerm: undefined,
    });
    onRefresh();
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            size="small"
            label="Client Root"
            placeholder="Enter client root"
            value={filters.clientName || ''}
            onChange={handleClientNameChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Period</InputLabel>
            <Select
              value={filters.dateFrom || 'last30days'}
              label="Period"
            >
              <MenuItem value="last7days">Last 7 days</MenuItem>
              <MenuItem value="last30days">Last 30 days</MenuItem>
              <MenuItem value="last90days">Last 90 days</MenuItem>
              <MenuItem value="lastYear">Last year</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              sx={{ cursor: 'pointer', textDecoration: 'none' }}
            >
              {showMoreFilters ? '− Less Search Filters' : '+ More Search Filters'}
            </Link>
          </Box>
        </Grid>
      </Grid>

      {showMoreFilters && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Request Type</InputLabel>
              <Select
                value={filters.agreementType?.[0] || ''}
                onChange={(e) => handleTypeChange(e as SelectChangeEvent<string[]>)}
                label="Request Type"
              >
                <MenuItem value="">Select an option from the list</MenuItem>
                {agreementTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Program / Subprogram</InputLabel>
              <Select label="Program / Subprogram">
                <MenuItem value="">Select an option from the list</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Account N°"
              placeholder="Enter an account number"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="IA Code"
              placeholder="Enter IA code"
            />
          </Grid>
        </Grid>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={handleClearFilters}
          sx={{ textTransform: 'none' }}
        >
          Reset Filters
        </Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {}}
            sx={{ textTransform: 'none' }}
          >
            Save Filter Settings
          </Button>
          <Button
            variant="contained"
            onClick={onRefresh}
            sx={{ textTransform: 'none' }}
          >
            Search
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AgreementFilters;
