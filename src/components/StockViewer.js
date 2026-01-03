import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Chip,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Search as SearchIcon,
  Inventory as InventoryIcon,
  Store as StoreIcon
} from '@mui/icons-material';
import { stockService } from '../services/StockService';

const SHOPS = ['Az Tires', 'LJ Tires'];

function StockViewer() {
  const [selectedShop, setSelectedShop] = useState('Az Tires');
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load available stock when shop changes
  useEffect(() => {
    loadAvailableStock();
  }, [selectedShop]);

  // Filter items when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(items);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = items.filter(item =>
        (item.brand && item.brand.toLowerCase().includes(term)) ||
        (item.name && item.name.toLowerCase().includes(term)) ||
        (item.category && item.category.toLowerCase().includes(term)) ||
        (item.description && item.description.toLowerCase().includes(term))
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  const loadAvailableStock = async () => {
    try {
      setLoading(true);
      setError(null);
      const availableItems = await stockService.getAvailableStock(selectedShop);
      setItems(availableItems);
      setFilteredItems(availableItems);
    } catch (err) {
      console.error('Error loading stock:', err);
      setError('Failed to load available stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* App Bar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <InventoryIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AZtires Stock Viewer
          </Typography>
          <Chip
            icon={<StoreIcon />}
            label={selectedShop}
            color="secondary"
            variant="filled"
            sx={{
              fontWeight: 'bold',
              fontSize: '0.95rem',
              height: '36px'
            }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Shop Selection */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Select Shop:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {SHOPS.map((shop) => (
              <Chip
                key={shop}
                label={shop}
                onClick={() => setSelectedShop(shop)}
                color={selectedShop === shop ? 'primary' : 'default'}
                variant={selectedShop === shop ? 'filled' : 'outlined'}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Paper>

        {/* Search Bar */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by brand, name, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            Showing {filteredItems.length} of {items.length} available items
          </Typography>
        </Paper>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Stock Cards */}
            {filteredItems.length === 0 ? (
              <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  {searchTerm ? 'No items found matching your search' : 'No available stock'}
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {filteredItems.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                    <Card
                      elevation={3}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                          <Chip
                            label={item.category}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Chip
                            label={`Qty: ${item.quantity}`}
                            size="small"
                            color="success"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </Box>

                        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                          {item.name || 'Unnamed Item'}
                        </Typography>

                        {item.brand && (
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Brand: <strong>{item.brand}</strong>
                          </Typography>
                        )}

                        {item.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '40px' }}>
                            {item.description}
                          </Typography>
                        )}

                        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #e0e0e0' }}>
                          <Typography variant="body2" color="text.secondary">
                            Selling Price:
                          </Typography>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                            {formatPrice(item.sellingPrice)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default StockViewer;

