'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../lib/queries'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../../../styles/login.module.css'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login, { loading, error }] = useMutation(LOGIN)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await login({ variables: { username, password } })
      localStorage.setItem('token', res.data.login)
      router.push('/homepage')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your account</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input
              id="username"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          {error && <p className={styles.error}>{error.message}</p>}
          
          <div className={styles.registerLink}>
            Don&#39;t have an account? <Link href="/register" className={styles.link}>Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  )
}