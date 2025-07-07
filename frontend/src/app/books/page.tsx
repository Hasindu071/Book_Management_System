'use client';

import { gql, useQuery, useMutation } from '@apollo/client';
import { CircularProgress, Typography, Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar, Chip, IconButton } from '@mui/material';
import { Delete, Edit, Add, Search } from '@mui/icons-material';
import styles from '../../../styles/books.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Define the GraphQL query to fetch books
const GET_BOOKS = gql`
  query {
    books {
      id
      title
      author
      genre
      publishedYear
    }
  }
`;
// Define the input type for updating a book
const DELETE_BOOK = gql`
  mutation DeleteBook($id: Int!) {
    deleteBook(id: $id) {
      id
    }
  }
`;
// Define the input type for updating a book
const UPDATE_BOOK = gql`
  mutation UpdateBook($id: Int!, $data: UpdateBookInput!) {
    updateBook(id: $id, data: $data) {
      id
      title
      author
      genre
      publishedYear
    }
  }
`;
// Define the Book type for TypeScript
type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
};
// Books component to display and manage the book collection
export default function Books() {
  const { data, loading, error, refetch } = useQuery(GET_BOOKS);
  const [deleteBook] = useMutation(DELETE_BOOK);
  const [updateBook] = useMutation(UPDATE_BOOK);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    publishedYear: ''
  });
  const [errors, setErrors] = useState({
    title: '',
    author: '',
    genre: '',
    publishedYear: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
// Validate form data before updating
  const validateForm = () => {
    const currentYear = new Date().getFullYear();
    const newErrors: typeof errors = {
      title: '',
      author: '',
      genre: '',
      publishedYear: ''
    };
// Validate form data
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
    }
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required.';
    }
    if (!formData.genre.trim()) {
      newErrors.genre = 'Genre is required.';
    }
    if (!formData.publishedYear.trim()) {
      newErrors.publishedYear = 'Published year is required.';
    } else if (isNaN(Number(formData.publishedYear)) || Number(formData.publishedYear) < 1000 || Number(formData.publishedYear) > currentYear) {
      newErrors.publishedYear = `Published year must be between 1000 and ${currentYear}.`;
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };
// Handle delete book action
  const handleDelete = async () => {
    if (bookToDelete !== null) {
      try {
        await deleteBook({ variables: { id: bookToDelete } });
        refetch();
        showSnackbar('Book deleted successfully!', 'success');
      } catch {
        showSnackbar('Failed to delete book', 'error');
      } finally {
        handleCloseDeleteDialog();
      }
    }
  };
// Open dialog handler for updating book details
  const handleOpenDialog = (book: Book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      publishedYear: book.publishedYear.toString()
    });
    setErrors({
      title: '',
      author: '',
      genre: '',
      publishedYear: ''
    });
    setOpenDialog(true);
  };
  // Close dialog handler
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBook(null);
  };
  // Open delete dialog handler
  const handleOpenDeleteDialog = (id: number) => {
    setBookToDelete(id);
    setDeleteDialogOpen(true);
  };
  // Close delete dialog handler
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setBookToDelete(null);
  };
 // Handle update book action
  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (selectedBook) {
        await updateBook({
          variables: {
            id: selectedBook.id,
            data: {
              title: formData.title,
              author: formData.author,
              genre: formData.genre,
              publishedYear: parseInt(formData.publishedYear)
            }
          }
        });
        refetch();
        handleCloseDialog();
        showSnackbar('Book updated successfully!', 'success');
      }
    } catch {
      showSnackbar('Failed to update book', 'error');
    }
  };
  // Show snackbar with message and severity
  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };
  // Close snackbar handler
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  // Filter books based on search input
  const filteredBooks = data?.books.filter((book: Book) =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase()) ||
    book.genre.toLowerCase().includes(search.toLowerCase())
  );
  // If loading, display a loading spinner
  if (loading) return (
    <Box className={styles.loadingContainer}>
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" mt={2}>Loading your books...</Typography>
    </Box>
  );
  // If there's an error, display an error message
  if (error) return (
    <Box className={styles.errorContainer}>
      <Alert severity="error" sx={{ width: '100%' }}>
        <Typography variant="h6">Error loading books</Typography>
        <Typography>{error.message}</Typography>
      </Alert>
    </Box>
  );

  return (
    <div className={styles.container}>
      <Box className={styles.headerContainer}>
        <Button
          variant="outlined"
          onClick={() => router.back()}
          className={styles.backButton}
        >
          Back
        </Button>
        <Typography variant="h4" className={styles.header} gutterBottom>
          📚 My Book Collection
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {data?.books.length} books in your library
        </Typography>
      </Box>

      <Box className={styles.toolbar}>
        <TextField
          label="Search books"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <Search color="action" sx={{ mr: 1 }} />
          }}
          sx={{ maxWidth: 400 }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => window.location.href = '/addBooks'}
          className={styles.addButton}
        >
          Add Book
        </Button>
      </Box>

      <Box className={styles.tableContainer}>
        {filteredBooks.length === 0 ? (
          <Box className={styles.emptyState}>
            <Typography variant="h6" color="text.secondary">
              No books found matching your search
            </Typography>
          </Box>
        ) : (
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {filteredBooks.map((book: Book) => (
                <tr key={book.id}>
                  <td>
                    <Typography fontWeight="600">
                      {book.title}
                    </Typography>
                  </td>
                  <td>{book.author}</td>
                  <td>
                    <Chip 
                      label={book.genre}
                      size="small"
                      sx={{ 
                        backgroundColor: '#4caf50',
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                  </td>
                  <td>{book.publishedYear}</td>
                  <td className={styles.actionsCell}>
                    <IconButton 
                      color="primary"
                      onClick={() => handleOpenDialog(book)}
                      aria-label="edit"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      color="error"
                      onClick={() => handleOpenDeleteDialog(book.id)}
                      aria-label="delete"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Box>

      {/* Update Book Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Update Book Details</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField
              label="Author"
              fullWidth
              variant="outlined"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              error={!!errors.author}
              helperText={errors.author}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <label htmlFor="genre" style={{ fontWeight: 'bold', marginBottom: '8px' }}>Genre</label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                style={{
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '16px',
                  width: '100%',
                }}
                required
              >
                <option value="" disabled>Select a genre</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Mystery">Mystery</option>
                <option value="Biography">Biography</option>
                <option value="History">History</option>
                <option value="Romance">Romance</option>
              </select>
              {errors.genre && <p style={{ color: 'red', fontSize: '0.875rem' }}>{errors.genre}</p>}
            </Box>
            <TextField
              label="Published Year"
              fullWidth
              variant="outlined"
              type="number"
              value={formData.publishedYear}
              onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
              inputProps={{
                min: 1000,
                max: new Date().getFullYear()
              }}
              error={!!errors.publishedYear}
              helperText={errors.publishedYear}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button 
            onClick={handleUpdate} 
            variant="contained"
            disabled={!formData.title || !formData.author || !formData.genre || !formData.publishedYear}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this book? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}