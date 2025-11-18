import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Input,
  Button,
  VStack,
  Heading,
  Text
} from '@chakra-ui/react';
import { Tabs, Tab, Box as MuiBox, Snackbar, Alert } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function Auth() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerData, setRegisterData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!loginEmail || !loginPassword) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    const result = await login(loginEmail, loginPassword);
    setLoading(false);

    if (result.success) {
      setSnackbar({ open: true, message: 'Login successful', severity: 'success' });
      setTimeout(() => navigate('/'), 500);
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!registerData.userName || !registerData.email || !registerData.password) {
      setError('Username, email, and password are required');
      setLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...userData } = registerData;
    const result = await register(userData);
    setLoading(false);

    if (result.success) {
      setSnackbar({ open: true, message: 'Registration successful', severity: 'success' });
      setTimeout(() => navigate('/'), 500);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center" py={8}>
      <Container maxW="md">
        <Box bg="white" p={8} borderRadius="lg" boxShadow="lg">
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading size="lg" color="blue.600" mb={2}>
                Bloggram
              </Heading>
              <Text color="gray.600">Welcome! Please sign in or create an account</Text>
            </Box>

            {error && (
              <Box
                bg="red.50"
                border="1px"
                borderColor="red.200"
                borderRadius="md"
                p={3}
                display="flex"
                alignItems="center"
                gap={2}
                color="red.700"
              >
                <ErrorIcon fontSize="small" />
                <Text fontSize="sm" fontWeight="medium">
                  {error}
                </Text>
              </Box>
            )}

            <MuiBox sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
                <Tab label="Login" sx={{ flex: 1 }} />
                <Tab label="Register" sx={{ flex: 1 }} />
              </Tabs>
            </MuiBox>

            {/* Login Panel */}
            {tabIndex === 0 && (
              <Box pt={2}>
                <form onSubmit={handleLogin}>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        Email <Text as="span" color="red.500">*</Text>
                      </Text>
                      <Input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Enter your email"
                        size="lg"
                        required
                      />
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        Password <Text as="span" color="red.500">*</Text>
                      </Text>
                      <Input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
                        size="lg"
                        required
                      />
                    </Box>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      width="full"
                      isLoading={loading}
                      loadingText="Signing in..."
                    >
                      Sign In
                    </Button>
                  </VStack>
                </form>
              </Box>
            )}

            {/* Register Panel */}
            {tabIndex === 1 && (
              <Box pt={2}>
                <form onSubmit={handleRegister}>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        Username <Text as="span" color="red.500">*</Text>
                      </Text>
                      <Input
                        type="text"
                        value={registerData.userName}
                        onChange={(e) =>
                          setRegisterData({ ...registerData, userName: e.target.value })
                        }
                        placeholder="Choose a username"
                        size="lg"
                        required
                      />
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        Email <Text as="span" color="red.500">*</Text>
                      </Text>
                      <Input
                        type="email"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({ ...registerData, email: e.target.value })
                        }
                        placeholder="Enter your email"
                        size="lg"
                        required
                      />
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        Password <Text as="span" color="red.500">*</Text>
                      </Text>
                      <Input
                        type="password"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({ ...registerData, password: e.target.value })
                        }
                        placeholder="Create a password (min 6 characters)"
                        size="lg"
                        required
                      />
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        Confirm Password <Text as="span" color="red.500">*</Text>
                      </Text>
                      <Input
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                          setRegisterData({ ...registerData, confirmPassword: e.target.value })
                        }
                        placeholder="Confirm your password"
                        size="lg"
                        required
                      />
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        Bio (Optional)
                      </Text>
                      <Input
                        type="text"
                        value={registerData.bio}
                        onChange={(e) =>
                          setRegisterData({ ...registerData, bio: e.target.value })
                        }
                        placeholder="Tell us about yourself"
                        size="lg"
                      />
                    </Box>

                    <Button
                      type="submit"
                      colorScheme="blue"
                      size="lg"
                      width="full"
                      isLoading={loading}
                      loadingText="Creating account..."
                    >
                      Create Account
                    </Button>
                  </VStack>
                </form>
              </Box>
            )}
          </VStack>
        </Box>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

