'use client'
import Link from 'next/link'
import styles from '../../../styles/home.module.css'

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.content}>
          <h1 className={styles.title}>📚 Welcome to the Book Management System</h1>
          <p className={styles.subtitle}>Organize, discover, and manage your literary collection with ease</p>
          
          <div className={styles.buttonContainer}>
            <Link href="/books" className={styles.primaryButton}>
              Browse Your Library
            </Link>
            <Link href="/addBooks" className={styles.secondaryButton}>
              Add New Books
            </Link>
          </div>
        </div>
        
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔍</div>
            <h3>Easy Search</h3>
            <p>Quickly find any book in your collection</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>➕</div>
            <h3>Simple Add</h3>
            <p>Add new books with just a few clicks</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your reading journey</p>
          </div>
        </div>
      </div>
    </main>
  )
}