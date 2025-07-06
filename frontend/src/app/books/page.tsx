'use client'

import { gql, useQuery, useMutation } from '@apollo/client'

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

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this book?')) {
      await deleteBook({ variables: { id } })
      refetch() // refresh book list
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div style={{ padding: '40px' }}>
      <h1>📚 Book List</h1>
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.books.map((book: Book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.publishedYear}</td>
              <td>
                <button onClick={() => handleDelete(book.id)}>🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}