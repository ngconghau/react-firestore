import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import firebase, { database, serverTimestamp, storage } from '../../../firebase'
import styles from '../../../styles/Post.module.css'
import Post from './Post'
import PostForm from './PostFrom'

const PostPage = ({ currentUser }) => {
  const [posts, setPosts] = useState([])
  const [userPosts, setUserPosts] = useState([])
  const [follow, setFollow] = useState([])

  // run after component render
  useEffect(() => {
    const check = database
      .collection('following')
      .doc(currentUser.id)
      .collection('userFollowing')
      .onSnapshot(async (querySnapshot) => {
        let follows = [currentUser.id]
        querySnapshot.forEach((doc) => {
          follows = [...follows, doc.id]
        })
        setFollow(follows)
      })
    const getAllUserPosts = database
      .collectionGroup('userPosts')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        let userPosts = []
        querySnapshot.forEach((doc) => {
          userPosts.push({
            uid: doc.ref.parent.parent.id,
            upid: doc.id,
            data: {
              title: doc.data().title,
              content: doc.data().content,
              imageUrl: doc.data().imageUrl,
              createdAt: doc.data().createdAt,
            },
          })
        })
        if (!querySnapshot.metadata.hasPendingWrites) {
          setUserPosts(userPosts)
        }
      })
    return () => {
      getAllUserPosts()
      check()
    }
  }, [currentUser])

  useEffect(() => {
    if (!userPosts.length && !follow.length) {
      return
    }
    if (follow.length) {
      const getAllUsers = database
        .collection('users')
        .where(firebase.firestore.FieldPath.documentId(), 'in', follow)
        .onSnapshot((querySnapshot) => {
          let users = []
          querySnapshot.forEach((doc) => {
            users.push({
              id: doc.id,
              name: doc.data().name,
            })
          })

          let userId = users.map((uid) => {
            return uid.id
          })

          let posts = userPosts.filter((upost) => {
            return userId.includes(upost.uid)
          })

          let userPostList = []
          posts.map((post) => {
            const user = users.find((u) => {
              return u.id === post.uid
            })
            userPostList.push({
              id: post.upid,
              authour: user.name,
              title: post.data.title,
              content: post.data.content,
              imageUrl: post.data.imageUrl,
              createdAt: post.data.createdAt
                .toDate()
                .toDateString()
                .concat(
                  ', ',
                  post.data.createdAt.toDate().toLocaleTimeString()
                ),
            })
          })
          setPosts(userPostList)
        })
      return getAllUsers
    }
  }, [userPosts, follow])

  const handleCreatePost = (text) => {
    if (text.image) {
      const uploadTask = storage
        .ref()
        .child(`image/${text.image.name + uuidv4()}`)
        .put(text.image)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        },
        (error) => {
          console.log(error)
        },
        () => {
          uploadTask.snapshot.ref.getMetadata().then((metadata) => {
            console.log(metadata)
          })
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            database
              .collection('posts')
              .doc(currentUser.id)
              .collection('userPosts')
              .add({
                title: text.title,
                content: text.content,
                imageUrl: downloadURL,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              })
          })
        }
      )
    } else {
      database
        .collection('posts')
        .doc(currentUser.id)
        .collection('userPosts')
        .add({
          title: text.title,
          content: text.content,
          imageUrl: text.image,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
    }
  }
  return (
    <div className={styles.wrapper_container}>
      <PostForm user={currentUser} handleCreatePost={handleCreatePost} />
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}

export default PostPage
