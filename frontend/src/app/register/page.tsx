'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTER } from '../lib/queries';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
      localStorage.setItem('token', res.data.register);
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Your Account</h1>
        <p className={styles.subtitle}>Join our community today</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input
              id="username"
              className={styles.input}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors((prev) => ({ ...prev, username: '' }));
              }}
              placeholder="Enter your username"
              required
            />
            {errors.username && <p className={styles.error}>{errors.username}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: '' }));
              }}
              placeholder="Enter your password"
              required
            />
            {errors.password && <p className={styles.error}>{errors.password}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              placeholder="Confirm your password"
              required
            />
            {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={loading || Object.values(errors).some((error) => error.length > 0)}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>

          {error && <p className={styles.error}>{error.message}</p>}

          <div className={styles.loginLink}>
            Already have an account? <Link href="/login" className={styles.link}>Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}