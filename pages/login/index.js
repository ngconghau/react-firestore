import React from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from '../../styles/Login.module.css'

export default function Login() {
  const {
    values,
    handleOnChange,
    handleSignIn,
    handleSignUp,
    clearState,
  } = useAuth()
  return (
    <div className={styles.login}>
      <div className={styles.loginContainer}>
        {!values.hasAccount ? (
          <form onSubmit={handleSignIn}>
            <label>Email</label>
            <input
              type="text"
              name="email"
              autoFocus
              required
              value={values.email}
              onChange={handleOnChange}
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              autoFocus
              required
              value={values.password}
              onChange={handleOnChange}
            />
            <div className={styles.btnContainer}>
              <button type="submit">Sign In</button>
              <p>
                Don&apos;t have an account?{' '}
                <span onClick={clearState}>Sign Up</span>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            <label>Name</label>
            <input
              type="text"
              autoFocus
              required
              name="username"
              value={values.username}
              onChange={handleOnChange}
            />
            <label>Email</label>
            <input
              type="text"
              autoFocus
              required
              name="email"
              value={values.email}
              onChange={handleOnChange}
            />
            <label>Password</label>
            <input
              type="password"
              autoFocus
              required
              name="password"
              value={values.password}
              onChange={handleOnChange}
            />
            <label>Date of birth</label>
            <input
              type="date"
              autoFocus
              name="dateofbirth"
              value={values.dateofbirth}
              onChange={handleOnChange}
            />
            <div className={styles.btnContainer}>
              <button>Sign Up</button>
              <p>
                Have an account? <span onClick={clearState}>Sign In</span>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
