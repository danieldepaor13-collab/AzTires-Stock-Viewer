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
    <Box 
      sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        pb: { xs: 2, sm: 3 }
      }}
    >
      {/* App Bar */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
          boxShadow: '0px 4px 20px rgba(26, 35, 126, 0.3)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 }, py: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 36, sm: 44 },
              height: { xs: 36, sm: 44 },
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.15)',
              mr: { xs: 1.5, sm: 2 },
            }}
          >
            <InventoryIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, color: 'white' }} />
          </Box>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontSize: { xs: '1rem', sm: '1.5rem' },
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.02em'
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              AZtires Stock Viewer
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
              Stock Viewer
            </Box>
          </Typography>
          <Chip
            icon={<StoreIcon sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />}
            label={selectedShop}
            sx={{
              fontWeight: 600,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              height: { xs: '36px', sm: '40px' },
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)',
              '& .MuiChip-label': {
                px: { xs: 1.5, sm: 2 }
              },
              '& .MuiChip-icon': {
                color: 'white'
              }
            }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
        {/* Shop Selection */}
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 2, sm: 2.5 }, 
            mb: { xs: 2.5, sm: 3 },
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          <Typography 
            variant="subtitle1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem' }, 
              mb: { xs: 1.5, sm: 2 },
              fontWeight: 600,
              color: '#1a237e',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Select Shop
          </Typography>
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, flexWrap: 'wrap' }}>
            {SHOPS.map((shop) => (
              <Chip
                key={shop}
                label={shop}
                onClick={() => setSelectedShop(shop)}
                sx={{ 
                  cursor: 'pointer',
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  height: { xs: '36px', sm: '40px' },
                  minWidth: { xs: '100px', sm: '120px' },
                  fontWeight: 600,
                  background: selectedShop === shop 
                    ? 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)'
                    : 'rgba(26, 35, 126, 0.08)',
                  color: selectedShop === shop ? 'white' : '#1a237e',
                  border: selectedShop === shop ? 'none' : '2px solid rgba(26, 35, 126, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: selectedShop === shop 
                      ? 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)'
                      : 'rgba(26, 35, 126, 0.15)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0px 4px 12px rgba(26, 35, 126, 0.2)'
                  },
                  '& .MuiChip-label': {
                    px: { xs: 2, sm: 2.5 }
                  }
                }}
              />
            ))}
          </Box>
        </Paper>

        {/* Search Bar */}
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 2, sm: 2.5 }, 
            mb: { xs: 2.5, sm: 3 },
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          <TextField
            fullWidth
            placeholder="Search by brand, name, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ 
                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                    color: '#1a237e'
                  }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              mb: { xs: 1.5, sm: 2 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: 'white',
                '& fieldset': {
                  borderColor: 'rgba(26, 35, 126, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(26, 35, 126, 0.4)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1a237e',
                  borderWidth: 2,
                },
              },
              '& .MuiInputBase-input': {
                fontSize: { xs: '0.9rem', sm: '1rem' },
                py: { xs: 1.5, sm: 1.75 },
                fontWeight: 500
              }
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 500,
                color: '#6c757d'
              }}
            >
              Showing
            </Typography>
            <Chip
              label={`${filteredItems.length} of ${items.length}`}
              size="small"
              sx={{
                background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                height: { xs: '24px', sm: '28px' }
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 500,
                color: '#6c757d'
              }}
            >
              available items
            </Typography>
          </Box>
        </Paper>

        {/* Error Message */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: { xs: 2, sm: 3 } }} 
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 6, sm: 8 } }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <>
            {/* Stock Cards */}
            {filteredItems.length === 0 ? (
              <Paper 
                elevation={0}
                sx={{ 
                  p: { xs: 4, sm: 6 }, 
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                  borderRadius: 3
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontSize: { xs: '1rem', sm: '1.5rem' },
                    fontWeight: 600,
                    color: '#6c757d',
                    mb: 1
                  }}
                >
                  {searchTerm ? 'No items found' : 'No available stock'}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    color: '#9ca3af'
                  }}
                >
                  {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new stock'}
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {filteredItems.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.8)',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        overflow: 'hidden',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: 'linear-gradient(90deg, #1a237e 0%, #0d47a1 100%)',
                        },
                        '&:hover': {
                          transform: { xs: 'none', sm: 'translateY(-8px)' },
                          boxShadow: '0px 12px 40px rgba(26, 35, 126, 0.15)',
                          borderColor: 'rgba(26, 35, 126, 0.3)',
                        },
                        '&:active': {
                          transform: { xs: 'scale(0.98)', sm: 'translateY(-4px)' }
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 2.5 } }}>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'start', 
                            mb: { xs: 1.5, sm: 2 },
                            gap: 1
                          }}
                        >
                          <Chip
                            label={item.category}
                            size="small"
                            sx={{
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              height: { xs: '26px', sm: '30px' },
                              fontWeight: 600,
                              background: 'rgba(26, 35, 126, 0.1)',
                              color: '#1a237e',
                              border: '1px solid rgba(26, 35, 126, 0.2)'
                            }}
                          />
                          <Chip
                            label={`${item.quantity} units`}
                            size="small"
                            sx={{ 
                              fontWeight: 700,
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              height: { xs: '26px', sm: '30px' },
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: 'white',
                              boxShadow: '0px 2px 8px rgba(16, 185, 129, 0.3)'
                            }}
                          />
                        </Box>

                        <Typography 
                          variant="h6" 
                          component="h3" 
                          gutterBottom 
                          sx={{ 
                            fontWeight: 700, 
                            mb: { xs: 1, sm: 1.5 },
                            fontSize: { xs: '1.1rem', sm: '1.3rem' },
                            lineHeight: { xs: 1.3, sm: 1.4 },
                            color: '#1a1a1a',
                            letterSpacing: '-0.01em'
                          }}
                        >
                          {item.name || 'Unnamed Item'}
                        </Typography>

                        {item.brand && (
                          <Box sx={{ mb: { xs: 1, sm: 1.5 } }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                color: '#6c757d',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontWeight: 600
                              }}
                            >
                              Brand
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                fontWeight: 600,
                                color: '#1a237e',
                                mt: 0.5
                              }}
                            >
                              {item.brand}
                            </Typography>
                          </Box>
                        )}

                        {item.description && (
                          <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                color: '#6c757d',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                fontWeight: 600
                              }}
                            >
                              Description
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                mt: 0.5,
                                minHeight: { xs: '40px', sm: '50px' },
                                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                lineHeight: { xs: 1.5, sm: 1.6 },
                                color: '#6c757d',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: { xs: 2, sm: 3 },
                                WebkitBoxOrient: 'vertical'
                              }}
                            >
                              {item.description}
                            </Typography>
                          </Box>
                        )}

                        <Box 
                          sx={{ 
                            mt: 'auto', 
                            pt: { xs: 2, sm: 2.5 }, 
                            borderTop: '2px solid rgba(26, 35, 126, 0.1)',
                            background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.02) 0%, rgba(13, 71, 161, 0.02) 100%)',
                            borderRadius: 2,
                            p: { xs: 1.5, sm: 2 },
                            mx: { xs: -2, sm: -2.5 },
                            mb: { xs: -2, sm: -2.5 }
                          }}
                        >
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              color: '#6c757d',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              fontWeight: 600,
                              display: 'block',
                              mb: 0.5
                            }}
                          >
                            Selling Price
                          </Typography>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontWeight: 700,
                              fontSize: { xs: '1.25rem', sm: '1.5rem' },
                              background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              letterSpacing: '-0.02em'
                            }}
                          >
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

