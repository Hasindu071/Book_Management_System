'use client';

import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, TextField, Button, Typography, MenuItem, CircularProgress, Alert } from '@mui/material';
import styles from '../../../styles/addBook.module.css';

// Define the GraphQL mutation to add a new book
const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!, $publishedYear: Int!, $genre: String!) {
    createBook(data: { title: $title, author: $author, publishedYear: $publishedYear, genre: $genre }) {
      id
      title
    }
  }
`;
// Define the input type for the book form
export default function AddBookPage() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publishedYear: '',
    genre: '',
  });
  const [errors, setErrors] = useState({
    title: '',
    author: '',
    publishedYear: '',
    genre: '',
  });
  const router = useRouter();
// Use Apollo Client's useMutation hook to create a new book
  const [createBook, { loading, error }] = useMutation(ADD_BOOK);
// Handle form input changes and update state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '', // Clear the error message for the field being updated
    }));
  };
// Validate form data before submission
  const validateForm = () => {
    const currentYear = new Date().getFullYear();
    const newErrors: typeof errors = {
      title: '',
      author: '',
      publishedYear: '',
      genre: '',
    };
// Check if all fields are filled and validate the published year
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
    }
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required.';
    }
    if (!formData.publishedYear.trim()) {
      newErrors.publishedYear = 'Published year is required.';
    } else if (
      isNaN(Number(formData.publishedYear)) ||
      Number(formData.publishedYear) < 1000 ||
      Number(formData.publishedYear) > currentYear
    ) {
      newErrors.publishedYear = `Published year must be between 1000 and ${currentYear}.`;
    }
    if (!formData.genre.trim()) {
      newErrors.genre = 'Genre is required.';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };
// Handle form submission to create a new book
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createBook({
        variables: {
          title: formData.title,
          author: formData.author,
          publishedYear: parseInt(formData.publishedYear),
          genre: formData.genre,
        },
      });
      router.push('/books');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.card}>
        <Typography variant="h4" className={styles.title}>
          📖 Add a New Book
        </Typography>
        <Typography variant="subtitle1" className={styles.subtitle}>
          Fill in the details to add to your collection
        </Typography>

        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            label="Book Title"
            name="title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            className={styles.input}
          />
          <TextField
            label="Author"
            name="author"
            fullWidth
            variant="outlined"
            value={formData.author}
            onChange={handleChange}
            error={!!errors.author}
            helperText={errors.author}
            className={styles.input}
          />
          <TextField
            label="Published Year"
            name="publishedYear"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.publishedYear}
            onChange={handleChange}
            error={!!errors.publishedYear}
            helperText={errors.publishedYear}
            className={styles.input}
          />
          <TextField
            label="Genre"
            name="genre"
            select
            fullWidth
            variant="outlined"
            value={formData.genre}
            onChange={handleChange}
            error={!!errors.genre}
            helperText={errors.genre}
            className={styles.input}
          >
            <MenuItem value="" disabled>
              Select a genre
            </MenuItem>
            <MenuItem value="Fiction">Fiction</MenuItem>
            <MenuItem value="Non-Fiction">Non-Fiction</MenuItem>
            <MenuItem value="Science Fiction">Science Fiction</MenuItem>
            <MenuItem value="Fantasy">Fantasy</MenuItem>
            <MenuItem value="Mystery">Mystery</MenuItem>
            <MenuItem value="Biography">Biography</MenuItem>
            <MenuItem value="History">History</MenuItem>
            <MenuItem value="Romance">Romance</MenuItem>
          </TextField>

          <Box className={styles.buttonGroup}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              className={styles.primaryButton}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Book'}
            </Button>
            <Link href="/homepage" passHref>
              <Button variant="outlined" color="secondary" fullWidth className={styles.secondaryButton}>
                Cancel
              </Button>
            </Link>
          </Box>

          {error && (
            <Alert severity="error" className={styles.error}>
              {error.message}
            </Alert>
          )}
        </form>
      </Box>
    </Box>
  );
}