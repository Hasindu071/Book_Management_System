'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../lib/queries';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import styles from '../../../styles/login.module.css';

// Define the GraphQL mutation for login
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [login, { loading, error }] = useMutation(LOGIN);
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {
      username: '',
      password: '',
    };

    // Username validation
    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };
// Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const res = await login({ variables: { username, password } });
      setSnackbar({
        open: true,
        message: 'Login successful! Redirecting...',
        severity: 'success',
      });
      localStorage.setItem('token', res.data.login);
      setTimeout(() => router.push('/homepage'), 2000);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Login failed. Please try again.',
        severity: 'error',
      });
      console.error(err);
    }
  };
// Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.card}>
        <Typography variant="h4" className={styles.title}>
          Welcome Back
        </Typography>
        <Typography variant="subtitle1" className={styles.subtitle}>
          Sign in to your account
        </Typography>

        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setErrors((prev) => ({ ...prev, username: '' }));
            }}
            error={!!errors.username}
            helperText={errors.username}
            className={styles.input}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: '' }));
            }}
            error={!!errors.password}
            helperText={errors.password}
            className={styles.input}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading || Object.values(errors).some((error) => error.length > 0)}
            className={styles.button}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          {error && <Typography className={styles.error}>{error.message}</Typography>}
          <Typography className={styles.registerLink}>
            Don&#39;t have an account?{' '}
            <Link href="/register" className={styles.link}>
              Sign up
            </Link>
          </Typography>
        </form>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}