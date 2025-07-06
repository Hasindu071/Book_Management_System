'use client';

import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';

const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!, $publishedYear: Int!, $genre: String!) {
    createBook(data: { title: $title, author: $author, publishedYear: $publishedYear, genre: $genre }) {
      id
      title
    }
  }
`;

export default function AddBookPage() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [genre, setGenre] = useState('');
  const router = useRouter();

  const [createBook, { loading, error }] = useMutation(ADD_BOOK);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createBook({
      variables: {
        title,
        author,
        publishedYear: parseInt(publishedYear),
        genre,
      },
    });

    router.push('/books');
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'Arial' }}>
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <br />
        <label>Author:</label>
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        <br />
        <label>Published Year:</label>
        <input
          type="number"
          value={publishedYear}
          onChange={(e) => setPublishedYear(e.target.value)}
          required
        />
        <br />
        <label>Genre:</label>
        <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} required />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Book'}
        </button>
        {error && <p style={{ color: 'red' }}>{error.message}</p>}
      </form>
    </div>
  );
}