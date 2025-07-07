'use client';

import Link from 'next/link';
import styles from '../../styles/webhome.module.css';

export default function Home() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>📚 Welcome to the Book Management System</h1>
      <p className={styles.subtitle}>Manage your books effortlessly</p>
      <div className={styles.buttonContainer}>
        <Link href="/login">
          <button className={styles.button}>Login</button>
        </Link>
        <Link href="/register">
          <button className={styles.button}>Register</button>
        </Link>
      </div>
    </main>
  );
}