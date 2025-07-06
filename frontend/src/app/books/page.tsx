'use client'

import { gql, useQuery, useMutation } from '@apollo/client'
import { CircularProgress, Typography, Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import styles from '../../../styles/books.module.css'
import { useState } from 'react'

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
`

const DELETE_BOOK = gql`
  mutation DeleteBook($id: Int!) {
    deleteBook(id: $id) {
      id
    }
  }
`

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
`

type Book = {
  id: number
  title: string
  author: string
  genre: string
  publishedYear: number
}

export default function Books() {
  const { data, loading, error, refetch } = useQuery(GET_BOOKS)
  const [deleteBook] = useMutation(DELETE_BOOK)
  const [updateBook] = useMutation(UPDATE_BOOK)
  const [search, setSearch] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    publishedYear: ''
  })

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this book?')) {
      await deleteBook({ variables: { id } })
      refetch() // refresh book list
    }
  }

  const handleOpenDialog = (book: Book) => {
    setSelectedBook(book)
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      publishedYear: book.publishedYear.toString()
    })
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedBook(null)
  }

  const handleUpdate = async () => {
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
      })
      refetch() // refresh book list
      handleCloseDialog()
    }
  }

  const filteredBooks = data?.books.filter((book: Book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <Box className={styles.loading}>
      <CircularProgress color="primary" />
      <Typography ml={2}>Loading books...</Typography>
    </Box>
  )

  if (error) return (
    <Box className={styles.error}>
      <Typography variant="h6">Error:</Typography>
      <Typography>{error.message}</Typography>
    </Box>
  )

  return (
    <div className={styles.container}>
      <Typography variant="h3" className={styles.header}>
        📚 Book List
      </Typography>

      <Box className={styles.searchBar}>
        <TextField
          label="Search by Title"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th>ID</th>
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
                <td>{book.id}</td>
                <td>
                  <Typography fontWeight="500">
                    {book.title}
                  </Typography>
                </td>
                <td>{book.author}</td>
                <td>
                  <Box 
                    sx={{
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      backgroundColor: '#4caf50'
                    }}
                  >
                    {book.genre}
                  </Box>
                </td>
                <td>{book.publishedYear}</td>
                <td>
                  <button 
                    className={styles.actionButton}
                    onClick={() => handleDelete(book.id)}
                  >
                    <span>🗑</span> Delete
                  </button>
                  <button 
                    className={styles.updateButton}
                    onClick={() => handleOpenDialog(book)}
                  >
                    <span>✏️</span> Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Book</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="dense"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            label="Author"
            fullWidth
            margin="dense"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          />
          <TextField
            label="Genre"
            fullWidth
            margin="dense"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          />
          <TextField
            label="Published Year"
            fullWidth
            margin="dense"
            type="number"
            value={formData.publishedYear}
            onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={handleUpdate} color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      <Button
        variant="contained"
        color="primary"
        className={styles.addButton}
        onClick={() => alert('Add Book functionality coming soon!')}
      >
        ➕ Add Book
      </Button>
    </div>
  )
}