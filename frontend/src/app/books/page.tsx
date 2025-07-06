'use client'
import { gql, useQuery } from '@apollo/client'

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

type Book = {
  id: string
  title: string
  author: string
  genre: string
  publishedYear: number
}

export default function Books() {
  const { data, loading, error } = useQuery(GET_BOOKS)

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}