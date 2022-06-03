import React from 'react'
import styles from '../../../../styles/Comment.module.css'
const Comment = ({ comment }) => {
  return (
    <div className={styles.comment_content}>
      <div className={styles.title_content}>
        <h4>{comment.authour}</h4>
        <span>{comment.createdAt}</span>
      </div>
      <p>{comment.content}</p>
    </div>
  )
}

export default Comment
