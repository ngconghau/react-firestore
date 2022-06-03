import React from 'react'
import Image from 'next/image'
import styles from '../../../styles/Post.module.css'
import Comments from './comments/Comments'

const Post = ({ post }) => {
  return (
    <div className={styles.post_container}>
      <div className={styles.user_profile}>
        <span>
          <Image src="/profile-pic.png" alt="profile" layout="fill" />
        </span>
        <div>
          <p>{post.authour}</p>
          <span>{post.createdAt}</span>
        </div>
      </div>
      <div className={styles.post_text}>
        <p>{post.title}</p>
        <p>{post.content}</p>
        {post.imageUrl && (<img src={post.imageUrl} />)}
      </div>
      <div className={styles.post_row}>
        <Comments postId={post.id} />
      </div>
    </div>
  )
}

export default Post
