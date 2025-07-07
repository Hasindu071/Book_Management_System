'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import styles from '../../../styles/home.module.css';

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Open confirmation dialog
  const handleOpenDialog = () => {
    setOpen(true);
  };

  // Close confirmation dialog
  const handleCloseDialog = () => {
    setOpen(false);
  };

  // Confirm logout
  const handleConfirmLogout = () => {
    // Clear user session (e.g., remove token from localStorage)
    localStorage.removeItem('token');
    // Redirect to the login page
    router.push('/login');
  };

  return (
    <Box className={styles.container}>
      {/* Logout button in the top-right corner */}
      <Box className={styles.logoutContainer}>
        <Button
          variant="contained"
          color="error"
          className={styles.logoutButton}
          onClick={handleOpenDialog}
        >
          Logout
        </Button>
      </Box>

      {/* Logout confirmation dialog */}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to log out? You will need to log in again to access your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="error" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      <Box className={styles.hero}>
        <Box className={styles.content}>
          <Typography variant="h3" className={styles.title}>
            📚 Welcome to the Book Management System
          </Typography>
          <Typography variant="subtitle1" className={styles.subtitle}>
            Organize, discover, and manage your literary collection with ease
          </Typography>

          <Box className={styles.buttonContainer}>
            <Link href="/books" passHref>
              <Button variant="contained" color="primary" className={styles.primaryButton}>
                View Books
              </Button>
            </Link>
            <Link href="/addBooks" passHref>
              <Button variant="outlined" color="primary" className={styles.secondaryButton}>
                Add New Books
              </Button>
            </Link>
          </Box>
        </Box>

        <Grid container spacing={3} className={styles.features}>
          <Grid item xs={12} sm={4}>
            <Card className={styles.featureCard}>
              <CardContent>
                <Typography variant="h4" className={styles.featureIcon}>
                  🔍
                </Typography>
                <Typography variant="h6" className={styles.featureTitle}>
                  Easy Search
                </Typography>
                <Typography variant="body2" className={styles.featureDescription}>
                  Quickly find any book in your collection
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card className={styles.featureCard}>
              <CardContent>
                <Typography variant="h4" className={styles.featureIcon}>
                  ➕
                </Typography>
                <Typography variant="h6" className={styles.featureTitle}>
                  Simple Add
                </Typography>
                <Typography variant="body2" className={styles.featureDescription}>
                  Add new books with just a few clicks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card className={styles.featureCard}>
              <CardContent>
                <Typography variant="h4" className={styles.featureIcon}>
                  📊
                </Typography>
                <Typography variant="h6" className={styles.featureTitle}>
                  Track Progress
                </Typography>
                <Typography variant="body2" className={styles.featureDescription}>
                  Monitor your reading journey
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}