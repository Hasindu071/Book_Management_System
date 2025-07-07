'use client';

import Link from 'next/link';
import { Box, Typography, Button } from '@mui/material';
import styles from '../../styles/webhome.module.css';

export default function Home() {
  return (
    <Box className={styles.container} component="main">
      <Typography variant="h3" className={styles.title}>
        📚 Welcome to the Book Management System
      </Typography>
      <Typography variant="subtitle1" className={styles.subtitle}>
        Manage your books effortlessly
      </Typography>
      <Box className={styles.buttonContainer}>
        <Link href="/login" passHref>
          <Button variant="contained" color="primary" className={styles.button}>
            Login
          </Button>
        </Link>
        <Link href="/register" passHref>
          <Button variant="outlined" color="primary" className={styles.button}>
            Register
          </Button>
        </Link>
      </Box>
    </Box>
  );
}