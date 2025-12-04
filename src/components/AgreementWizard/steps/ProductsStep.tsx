import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
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
  Autocomplete,
  Grid,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { FieldArray, FormikProps } from 'formik';
import { GET_PRODUCTS } from '@graphql/queries';
import { CreateAgreementFormValues, AgreementProductInput } from '../../../types';

type Props = FormikProps<CreateAgreementFormValues>;

const ProductsStep: React.FC<Props> = ({ values, setFieldValue, errors, touched }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentProduct, setCurrentProduct] = useState<AgreementProductInput>({
    productCode: '',
    productName: '',
    quantity: 1,
    unitPrice: 0,
    description: '',
  });
  const [rawProducts, setRawProducts] = React.useState<any>(null);

  const { data: productsData, loading: productsLoading } = useQuery(GET_PRODUCTS, {
    variables: { isActive: true },
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (!productsLoading) {
      import('../../../mocks/mockStore').then(({ getMockProducts }) => {
        const mockData = getMockProducts();
        if (mockData) {
          setRawProducts(mockData);
        }
      });
    }
  }, [productsLoading]);

  const products = rawProducts || productsData?.products || [];

  const handleOpenDialog = (index?: number) => {
    if (index !== undefined) {
      setEditIndex(index);
      setCurrentProduct(values.products[index]);
    } else {
      setEditIndex(null);
      setCurrentProduct({
        productCode: '',
        productName: '',
        quantity: 1,
        unitPrice: 0,
        description: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditIndex(null);
  };

  const handleSaveProduct = () => {
    const newProducts = [...values.products];
    if (editIndex !== null) {
      newProducts[editIndex] = currentProduct;
    } else {
      newProducts.push(currentProduct);
    }
    setFieldValue('products', newProducts);
    handleCloseDialog();
  };

  const calculateTotal = (product: AgreementProductInput) => {
    return product.quantity * product.unitPrice;
  };

  const calculateGrandTotal = () => {
    return values.products.reduce((sum, product) => sum + calculateTotal(product), 0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Products & Services</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Product
        </Button>
      </Box>

      {values.products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            No products added yet. Click "Add Product" to get started.
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <FieldArray name="products">
                  {({ remove }) => (
                    <>
                      {values.products.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.productName}</TableCell>
                          <TableCell>{product.productCode}</TableCell>
                          <TableCell align="right">{product.quantity}</TableCell>
                          <TableCell align="right">
                            ${product.unitPrice.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            ${calculateTotal(product).toFixed(2)}
                          </TableCell>
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
                      <TableRow>
                        <TableCell colSpan={4} align="right">
                          <Typography variant="h6">Grand Total:</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h6">
                            ${calculateGrandTotal().toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </>
                  )}
                </FieldArray>
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editIndex !== null ? 'Edit Product' : 'Add Product'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={products}
                getOptionLabel={(option) => `${option.name} (${option.code})`}
                loading={productsLoading}
                value={products.find((p: any) => p.code === currentProduct.productCode) || null}
                onChange={(_, value) => {
                  if (value) {
                    setCurrentProduct({
                      ...currentProduct,
                      productCode: value.code,
                      productName: value.name,
                      unitPrice: value.basePrice,
                    });
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Product" required />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={currentProduct.quantity}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    quantity: Number(e.target.value),
                  })
                }
                inputProps={{ min: 1 }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Unit Price"
                value={currentProduct.unitPrice}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    unitPrice: Number(e.target.value),
                  })
                }
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={currentProduct.description || ''}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    description: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveProduct}
            variant="contained"
            disabled={
              !currentProduct.productCode ||
              !currentProduct.productName ||
              currentProduct.quantity < 1 ||
              currentProduct.unitPrice < 0
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {touched.products && errors.products && typeof errors.products === 'string' && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {errors.products}
        </Typography>
      )}
    </Box>
  );
};

export default ProductsStep;
