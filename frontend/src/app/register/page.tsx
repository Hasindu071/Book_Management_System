'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER } from '../lib/queries';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import styles from '../../../styles/register.module.css';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
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
  const [register, { loading, error }] = useMutation(REGISTER);
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {
      username: '',
      password: '',
      confirmPassword: '',
    };

    // Username validation
    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long.';
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter.';
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = 'Password must contain at least one lowercase letter.';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least one number.';
    } else if (!/[!@#$%^&*]/.test(password)) {
      newErrors.password = 'Password must contain at least one special character (!@#$%^&*).';
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const res = await register({ variables: { username, password } });
      setSnackbar({
        open: true,
        message: 'Registration successful! Redirecting...',
        severity: 'success',
      });
      localStorage.setItem('token', res.data.register);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Registration failed. Please try again.',
        severity: 'error',
      });
      console.error(err);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.card}>
        <Typography variant="h4" className={styles.title}>
          Create Your Account
        </Typography>
        <Typography variant="subtitle1" className={styles.subtitle}>
          Join our community today
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
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            className={styles.input}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading || Object.values(errors).some((error) => error.length > 0)}
            className={styles.submitButton}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </Button>
          {error && <Typography className={styles.error}>{error.message}</Typography>}
          <Typography className={styles.loginLink}>
            Already have an account?{' '}
            <Link href="/login" className={styles.link}>
              Log in
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