import React, { useState, useRef, memo } from 'react'
import styles from '../../../../styles/Comment.module.css'

const CommentForm = ({handleCreateComment}) => {

  const [text, setText] = useState('')
  const textAreaRef = useRef()

  const handleSubmit = (e)=>{
    e.preventDefault()
    handleCreateComment(text)
    setText('')
    textAreaRef.current.focus()
  }
  
  return (
    <div className={styles.wirte_comment_container}>
      <textarea
        ref={textAreaRef}
        type="text"
        placeholder="Comment"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <input
        type="button"
        value="Create"
        disabled={text.length === 0}
        onClick={handleSubmit}
      />
    </div>
  )
}

export default memo(CommentForm)
