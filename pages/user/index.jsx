import React, { useState, useEffect, useContext } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from '../../styles/UserInfo.module.css'
import { database, serverTimestamp } from '../../firebase'
import Nav from '../nav'

const UserInfo = () => {
  const { user } = useAuth()
  const [newUser, setNewUser] = useState(user)

  useEffect(() => {
    setNewUser(user)
  }, [user])

  const handleUpdateUser = () => {
    database.collection('users').doc(newUser.id).update({
      name: newUser.name,
      email: newUser.email,
      dob: newUser.dateofbirth,
      updatedAt: serverTimestamp(),
    })
    alert('update success')
  }
  return (
    <>
      {user && (
        <div>
          <Nav />
          {newUser && (
            <div className={styles.card}>
              <div className={styles.row}>
                <div className={styles.col}>
                  <div className={styles.form_group}>
                    <label>Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => {
                        setNewUser({ ...newUser, name: e.target.value })
                      }}
                    />
                  </div>
                </div>
                <div className={styles.col}>
                  <div className={styles.form_group}>
                    <label>Email</label>
                    <input
                      type="text"
                      disabled
                      value={newUser.email}
                      onChange={(e) => {
                        setNewUser({ ...newUser, email: e.target.value })
                      }}
                    />
                  </div>
                </div>
                <div className={styles.col}>
                  <div className={styles.form_group}>
                    <label>Date of birth</label>
                    <input
                      type="date"
                      value={newUser.dateofbirth}
                      onChange={(e) => {
                        setNewUser({ ...newUser, dateofbirth: e.target.value })
                      }}
                    />
                  </div>
                </div>
                <div className={styles.col}>
                  <input
                    type="submit"
                    value="Update"
                    onClick={handleUpdateUser}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
export default UserInfo
