'use client';

import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/addBook.module.css';

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
    <div className={styles.container}>
      <h2 className={styles.title}>📖 Add a New Book</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>Title</label>
        <input
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className={styles.label}>Author</label>
        <input
          type="text"
          className={styles.input}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />

        <label className={styles.label}>Published Year</label>
        <input
          type="number"
          className={styles.input}
          value={publishedYear}
          onChange={(e) => setPublishedYear(e.target.value)}
          required
        />

        <label className={styles.label}>Genre</label>
        <input
          type="text"
          className={styles.input}
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
        />

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Adding...' : 'Add Book'}
        </button>

        {error && <p className={styles.error}>{error.message}</p>}
      </form>
    </div>
  );
}