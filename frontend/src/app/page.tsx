'use client'
import Link from 'next/link'
import styles from '../../styles/home.module.css'

export default function Home() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>📚 Welcome to the Book Management System</h1>
      <p className={styles.subtitle}>Manage your books effortlessly</p>
      <div className={styles.buttonContainer}>
        <Link href="/books">
          <button className={styles.button}>View Books</button>
        </Link>
        <Link href="/addBooks">
          <button className={styles.button}>Add Books</button>
        </Link>
        <Link href="/Login">
          <button className={styles.button}>Login</button>
        </Link>
        <Link href="/Signup">
          <button className={styles.button}>Signup</button>
        </Link>
      </div>
    </main>
  )
}