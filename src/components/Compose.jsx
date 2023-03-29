import React, { forwardRef, useEffect, useState } from 'react'
import "../styles/Compose.sass";
import images from "../images.js";
import { useStateValue } from '../StateProvider';
import iconDelete from "../images/icon-delete.svg";
import { fadeOut, parent } from '../utils';

export const Compose = forwardRef(({buttonText, replyTarget, textToEdit}, ref) => {
  
  // Context
  const [{currentUser, comments}, dispatch] = useStateValue();
  
  // Component States / Refs
  const [draft, setDraft] = useState('');

  const resetReply = () => {
    if (replyTarget) {
      const [{ username }] = replyTarget;
      setDraft(`@${username} `);
    }
  };
  
  useEffect(() => {
    ref?.current?.focus();
  }, [ref])

  useEffect(() => {
    setDraft(textToEdit);
  }, [textToEdit]);

  useEffect(() => {
    resetReply();
  }, [replyTarget])

  if (!currentUser)
      return <></>

  const { username: user } = currentUser;
      
  const clearDraft = () => setDraft('');

  const handleChange = (event) => {

      resizeTextArea(event);

      let text = event.target.value;

      if (draft)
          ref?.current.classList.remove('Invalid');

      setDraft(text);
  };

  const handleBlur = () => {
      ref?.current.classList.remove('Invalid');
  }

  const resizeTextArea = (event) => {
    event.target.style.height = '0px';

    const { scrollHeight } = event.target;
    
    event.target.style.height = scrollHeight > 175 ? '175px' : `${scrollHeight}px`;
  };

  const handleKeyDown = (event) => {

    resizeTextArea(event);

    if (draft.length < 50)
        event.target.style.height = 0;

    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        addComment();
    }

    if (event.key === "Escape")
        cancelCompose();
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

  const cancelCompose = async () => {
      clearDraft();

      // if reply form is active, fade out and close the form by setting reply target to null
      if (replyTarget) {
          const [{}, setReplyTarget] = replyTarget;
          fadeOut(parent(ref), () => setReplyTarget(null));
      }
  };
  
  const addComment = () => {
    const setInvalid = () => {
      setTimeout(() => {
        ref?.current?.classList.add('Invalid');
        ref?.current?.focus();
        resetReply();
      }, 100)
    };
    
    ref?.current.classList.remove('Invalid');
    
    if (!draft?.trim()) {
      console.log('INVALID', ref);
      setInvalid();
      return;
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

    if (textToEdit) {
        setInvalid();
        return
    }

    if (replyTarget) {
        const [{ id, username }, setReplyTarget] = replyTarget;

        delete newComment.replies;
        newComment.replyingTo = username;
        newComment.content = draft.replace(`@${username}`, '').trim();

        if (!newComment.content || newComment.content.match(/@[a-z0-9]*/gi)) {
            setInvalid();
            return;
        }

        copy = copy.map(comment => {
          if (comment.id === id || comment.replies.find(reply => reply.id === id))
              comment.replies.push(newComment);
          
          return comment;
        })

        setReplyTarget(null);
    }

    else
        copy = [...copy, newComment]

    // commit the new list of comments to Context
    dispatch({ type: "SET_COMMENTS", comments: copy });

    // finally, reset after creating comment
    clearDraft();
  };

  return (
    <div className='Compose'>
        <textarea ref={ref} placeholder='Add a comment...' value={draft} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />
        <img className='User' src={images[user]} alt={`photo of ${user}`} />

        <button onClick={addComment}>{buttonText || 'Send'}</button>
    </div>
  )
});
