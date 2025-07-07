'use client';
import Link from 'next/link';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import styles from '../../../styles/home.module.css';

export default function Home() {
  return (
    <Box className={styles.container}>
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