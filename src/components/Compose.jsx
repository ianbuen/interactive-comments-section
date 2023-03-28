import React, { forwardRef, useEffect, useState } from 'react'
import "../styles/Compose.sass";
import images from "../images.js";
import { useStateValue } from '../StateProvider';
import iconDelete from "../images/icon-delete.svg";

export const Compose = forwardRef((props, ref) => {

  const [{currentUser, comments, replyTarget}, dispatch] = useStateValue();
  const [draft, setDraft] = useState('');

  useEffect(() => {
    ref.current?.scrollIntoView({behavior: "smooth"});
  }, [draft])
  
  if (!currentUser)
      return <></>

  const { username } = currentUser;

  const discardDraft = () => {
    setDraft('');
    dispatch({ type: "SET_REPLY_DRAFT", replyTarget: null });
  }

  const handleChange = ({target: {value}}) => {
      if (draft)
          ref.current.classList.remove('Invalid');

      setDraft(value);
  };

  const handleBlur = () => {
      ref.current.classList.remove('Invalid');
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        addComment();
    }
  }

  const generateCommentID = () => {
    // gets the latest comment ID then add 1
    let id = 0;

    comments.forEach(comment => {
      id = comment.id > id ? comment.id : id;
      comment.replies.forEach(reply => id = reply.id > id ? reply.id : id);
    });

    return id + 1;
  };

  const addComment = () => {
    ref.current.classList.remove('Invalid');
    
    if (!draft.trim()) {
      setTimeout(() => {
        ref.current.classList.add('Invalid');
        ref.current.focus();
      }, 100)
      return
    }

    // initialize props for the new comment
    let newComment = {
      id: generateCommentID(),
      content: draft,
      createdAt: 'Today',
      score: 0,
      user: currentUser,
      replies: [],
    };

    // make a deep copy of existing comments
    let copy = [...comments]

    console.log(replyTarget.id);
    console.log(newComment);

    if (replyTarget) {
        delete newComment.replies;
        newComment.replyingTo = replyTarget.replyingTo;

        copy = copy.map(comment => {
          if (comment.id === replyTarget.id || comment.replies.find(reply => reply.id === replyTarget.id))
              comment.replies.push(newComment);
          
          return comment;
        })
    }

    // set the copy as the newly updated comments
    dispatch({
      type: "SET_COMMENTS",
      comments: copy
    });

    discardDraft();
  };

  return (
    <div className='Compose'>
        {replyTarget && <p>Replying to <span>{replyTarget?.replyingTo}</span></p>}
        <textarea ref={ref} placeholder='Add a comment...' value={draft} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />
        <img className='User' src={images[username]} alt={`photo of ${username}`} />

        <div className='ButtonGroup'>
          {(draft || replyTarget) && <img className='Delete' src={iconDelete} alt="delete icon" onClick={discardDraft} />}
          <button onClick={addComment}>Send</button>
        </div>
    </div>
  )
})
