'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { REGISTER } from '../lib/queries'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../../../styles/register.module.css'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [register, { loading, error }] = useMutation(REGISTER)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    
    try {
      const res = await register({ variables: { username, password } })
      localStorage.setItem('token', res.data.register)
      router.push('/login')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Your Account</h1>
        <p className={styles.subtitle}>Join our community today</p>
        
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
              onChange={(e) => {
                setPassword(e.target.value)
                if (confirmPassword && e.target.value !== confirmPassword) {
                  setPasswordError('Passwords do not match')
                } else {
                  setPasswordError('')
                }
              }}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (password !== e.target.value) {
                  setPasswordError('Passwords do not match')
                } else {
                  setPasswordError('')
                }
              }}
              placeholder="Confirm your password"
              required
            />
            {passwordError && <p className={styles.error}>{passwordError}</p>}
          </div>
          
          <button 
            type="submit" 
            className={styles.button} 
            disabled={loading || passwordError.length > 0}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
          
          {error && <p className={styles.error}>{error.message}</p>}
          
          <div className={styles.loginLink}>
            Already have an account? <Link href="/login" className={styles.link}>Log in</Link>
          </div>
        </form>
      </div>
    </div>
  )
}