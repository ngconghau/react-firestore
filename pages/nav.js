import React from 'react'
import {  useAuth } from '../context/AuthContext'
import Link from 'next/link'
import styles from '../styles/Nav.module.css'
import Image from 'next/image'

const Nav = () => {
  const { handleLogOut } = useAuth()
  return (
    <>
      <div className={styles.container}>
        <nav>
          <div className={styles.nav_left}>
            <Link href="/">
              <a className={styles.logo}>
                <Image src="/logo.png" alt="logo" layout="fill" />
              </a>
            </Link>
          </div>
          <div className={styles.nav_right}>
            <div className={styles.nav_user_icon}>
              <Link href="/user">
                <a>
                  <Image src="/profile-pic.png" alt="search" layout="fill" />
                </a>
              </Link>
            </div>
            <a onClick={handleLogOut}>Logout</a>
          </div>
        </nav>
      </div>
    </>
  )
}

export default Nav
