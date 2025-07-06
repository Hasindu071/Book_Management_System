'use client';

import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publishedYear: '',
    genre: ''
  });
  const [errors, setErrors] = useState({
    title: '',
    author: '',
    publishedYear: '',
    genre: ''
  });
  const router = useRouter();

  const [createBook, { loading, error }] = useMutation(ADD_BOOK);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: '' // Clear the error message for the field being updated
    }));
  };

  const validateForm = () => {
    const currentYear = new Date().getFullYear();
    const newErrors: typeof errors = {
      title: '',
      author: '',
      publishedYear: '',
      genre: ''
    };

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
    }
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required.';
    }
    if (!formData.publishedYear.trim()) {
      newErrors.publishedYear = 'Published year is required.';
    } else if (isNaN(Number(formData.publishedYear)) || Number(formData.publishedYear) < 1000 || Number(formData.publishedYear) > currentYear) {
      newErrors.publishedYear = `Published year must be between 1000 and ${currentYear}.`;
    }
    if (!formData.genre.trim()) {
      newErrors.genre = 'Genre is required.';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

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
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>📖 Add a New Book</h1>
          <p className={styles.subtitle}>Fill in the details to add to your collection</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>Book Title</label>
            <input
              id="title"
              type="text"
              name="title"
              className={styles.input}
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              required
            />
            {errors.title && <p className={styles.errorText}>{errors.title}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="author" className={styles.label}>Author</label>
            <input
              id="author"
              type="text"
              name="author"
              className={styles.input}
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              required
            />
            {errors.author && <p className={styles.errorText}>{errors.author}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="publishedYear" className={styles.label}>Published Year</label>
            <input
              id="publishedYear"
              type="number"
              name="publishedYear"
              className={styles.input}
              value={formData.publishedYear}
              onChange={handleChange}
              placeholder="Enter publication year"
              min="1000"
              max={new Date().getFullYear()}
              required
            />
            {errors.publishedYear && <p className={styles.errorText}>{errors.publishedYear}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="genre" className={styles.label}>Genre</label>
            <select
              id="genre"
              name="genre"
              className={styles.input}
              value={formData.genre}
              onChange={handleChange}
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
            {errors.genre && <p className={styles.errorText}>{errors.genre}</p>}
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.primaryButton} disabled={loading}>
              {loading ? (
                <span className={styles.spinner}></span>
              ) : (
                'Add Book'
              )}
            </button>
            <Link href="/homepage" className={styles.secondaryButton}>
              Cancel
            </Link>
          </div>

          {error && (
            <div className={styles.error}>
              <svg className={styles.errorIcon} viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
              {error.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}