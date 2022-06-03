import React from 'react'
import { useAuth } from '../context/AuthContext'
import Nav from './nav'
import styles from '../styles/Post.module.css'
import PostPage from '../components/dashboard/posts/Posts'
import Follows from '../components/dashboard/follows/Follows'

export default function Home() {
  const { user } = useAuth()
  return (
    <div>
      {user && (
        <>
          <Nav />
          <div className={styles.container}>
            <Follows currentUser={user} />
            <PostPage currentUser={user} />
          </div>
        </>
      )}
    </div>
  )
}
