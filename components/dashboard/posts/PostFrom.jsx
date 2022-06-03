import React, { useState } from 'react'
import styles from '../../../styles/Post.module.css'
import Image from 'next/image'

const PostForm = ({ user, handleCreatePost }) => {
  const [isHidden, setIsHidden] = useState('none')
  const [values, setValues] = useState({
    title: '',
    content: '',
    image: null,
  })

  const onSubmit = (e) => {
    e.preventDefault()
    handleCreatePost(values)
    const x = document.getElementById('upload')
    const y = document.getElementById('content')
    if (isHidden === 'none') {
      setIsHidden('block')
      y.style.borderBottom = 'none'
      x.style.borderBottom = '1px solid #ccc'
    } else {
      y.style.borderBottom = '1px solid #ccc'
      setIsHidden('none')
      x.value = ''
      setValues({ title: '', content: '', image: null })
    }
  }
  return (
    <div className={styles.write_post_container}>
      <div className={styles.user_profile}>
        <span>
          <Image src="/profile-pic.png" alt="" layout="fill" />
        </span>
        <div>
          <p>{user.name}</p>
        </div>
      </div>
      <div className={styles.post_input_container}>
        <form onSubmit={onSubmit}>
          <textarea
            type="text"
            placeholder="Title"
            required
            value={values.title}
            onChange={(e) => setValues({ ...values, title: e.target.value })}
          />
          <textarea
            id="content"
            rows="5"
            placeholder="Content"
            required
            value={values.content}
            onChange={(e) => setValues({ ...values, content: e.target.value })}
          />
          <input
            type="file"
            id="upload"
            style={{ display: `${isHidden}` }}
            onChange={(e) => setValues({ ...values, image: e.target.files[0] })}
          />
          <div className={styles.add_post_link}>
            <div>
              <span>
                <Image src="/live-video.png" alt="" layout="fill" />
              </span>
              Live Video
            </div>
            <div
              onClick={() => {
                const x = document.getElementById('upload')
                const y = document.getElementById('content')
                if (isHidden === 'none') {
                  setIsHidden('block')
                  y.style.borderBottom = 'none'
                  x.style.borderBottom = '1px solid #ccc'
                } else {
                  y.style.borderBottom = '1px solid #ccc'
                  setIsHidden('none')
                  x.value = ''
                  setValues({ ...values, image: null })
                }
              }}
            >
              <span>
                <Image src="/photo.png" alt="" layout="fill" />
              </span>
              Photo/Video
            </div>
            <div>
              <span>
                <Image src="/feeling.png" alt="" layout="fill" />
              </span>
              Feling/Activity
            </div>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostForm
