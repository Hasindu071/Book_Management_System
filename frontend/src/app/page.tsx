'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ textAlign: 'center', marginTop: '80px' }}>
      <h1>📚 Welcome to the Book Management System</h1>
      <p>Click below to view all books</p>
      <Link href="/books">
        <button
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          View Books
        </button>
      </Link>
            <Link href="/addBooks">
        <button
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Add Books
        </button>
      </Link>
    </main>
  )
}