'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/auth.module.css';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Add your signup logic here (e.g., API call)
    console.log('Signing up with:', { email, password });
    router.push('/login'); // Redirect to login page after signup
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Signup</h2>
      <form onSubmit={handleSignup} className={styles.form}>
        <label className={styles.label}>Email</label>
        <input
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className={styles.label}>Password</label>
        <input
          type="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className={styles.label}>Confirm Password</label>
        <input
          type="password"
          className={styles.input}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles.button}>
          Signup
        </button>
      </form>
    </div>
  );
}