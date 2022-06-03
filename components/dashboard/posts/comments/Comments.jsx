import React, { useState, useEffect,  memo } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { database, serverTimestamp } from '../../../../firebase'
import Comment from './Comment'
import CommentForm from './CommentForm'

const Comments = ({ postId }) => {
  const {user} = useAuth()
  const [postsComment, setPostComments] = useState([])

  
  useEffect(() => {
    const getComments = database
      .collection(`comments/${postId}/postComments`)
      .orderBy('createdAt', 'desc')
      .onSnapshot(async (querySnapshot) => {
        let comments = []
        querySnapshot.forEach((doc) => {
          if (!doc.metadata.hasPendingWrites) {
            comments.push({
              id: doc.id,
              data: doc.data(),
            })
          }
        })
        const arrComment = await Promise.all(
          comments.map(async (comment) => {
            const uCmt = {
              id: comment.id,
              content: comment.data.content,
              authour: (
                await database.doc(comment.data.userRef.path).get()
              ).data().name,
              createdAt: comment.data.createdAt
                .toDate()
                .toDateString()
                .concat(
                  ', ',
                  comment.data.createdAt.toDate().toLocaleTimeString()
                ),
            }
            return uCmt
          })
        )
        setPostComments(arrComment)
        return arrComment
      })
    return getComments
  }, [postId])

  const handleCreateComment = (text) => {
    database
      .collection('comments')
      .doc(postId)
      .collection('postComments')
      .add({
        content: text,
        createdAt: serverTimestamp(),
        userRef: database.doc(`/users/${user.id}`),
      })
  }

  return (
    <div>
      <div>
        <CommentForm handleCreateComment={handleCreateComment} />
      </div>
      {postsComment.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  )
}

export default memo(Comments) 
