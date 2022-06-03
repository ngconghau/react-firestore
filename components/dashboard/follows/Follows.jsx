import React, { useState, useRef, memo } from 'react'
import styles from '../../../styles/Follow.module.css'
import { database } from '../../../firebase'

const Follows = ({ currentUser }) => {
  const [text, setText] = useState('')
  const [users, setUser] = useState([])
  const inputRef = useRef()

  const handleSearch = async (e) => {
    e.preventDefault()
    await database
      .collection('users')
      .get()
      .then(async (snapshot) => {
        let users = []
        snapshot.forEach((doc) => {
          if (doc.data().name !== currentUser.name)
            if (
              doc.data().name.indexOf(text) !== -1 ||
              doc.data().email.indexOf(text) !== -1
            ) {
              users.push({ id: doc.id, name: doc.data().name, isFollow: false })
            }
        })
        const arrUser = await Promise.all(
          users.map(async (user) => {
            if (
              (
                await database
                  .doc(`following/${currentUser.id}/userFollowing/${user.id}`)
                  .get()
              ).exists
            ) {
              return { ...user, isFollow: true }
            } else {
              return user
            }
          })
        )
        setUser(arrUser)
      })
    setText('')
    inputRef.current.focus()
  }

  const handleFollow = (uid) => {
    database
      .collection('following')
      .doc(currentUser.id)
      .collection('userFollowing')
      .doc(uid)
      .set({})

    const newState = users.map((item) => {
      if (item.id === uid) {
        return { ...item, isFollow: !item.isFollow }
      }
      return item
    })
    setUser(newState)
  }

  const handleUnFollow = (uid) => {
    database
      .collection('following')
      .doc(currentUser.id)
      .collection('userFollowing')
      .doc(uid)
      .delete()
    const newState = users.map((item) => {
      if (item.id === uid) {
        return { ...item, isFollow: !item.isFollow }
      }
      return item
    })
    setUser(newState)
  }

  return (
    <div className={styles.follow_container}>
      <div className={styles.search_container}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Seach..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="button"
          value="Search"
          onClick={handleSearch}
          disabled={text.length === 0}
        />
      </div>
      <div className={styles.users_container}>
        {users.map((user) => (
          <div className={styles.user_follow} key={user.id}>
            <p>{user.name}</p>
            {user.isFollow ? (
              <button
                onClick={() => {
                  handleUnFollow(`${user.id}`)
                }}
              >
                Unfollow
              </button>
            ) : (
              <button onClick={() => handleFollow(`${user.id}`)}>
                Follows
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Follows
