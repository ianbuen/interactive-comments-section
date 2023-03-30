import React, { forwardRef, useEffect, useState } from 'react'
import "../styles/Compose.sass";
import images from "../images.js";
import { useStateValue } from '../StateProvider';
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

    if (textToEdit) {
      const { comment: {content, replyingTo} } = textToEdit;
      setDraft(`${replyingTo ? `@${replyingTo} ` : ''}${content}`);
    }
  };
  
  useEffect(() => {
    return; // optional
    ref?.current?.focus();
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [ref])

  useEffect(() => {
    resetReply();
  }, [replyTarget, textToEdit])

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
        exitCompose();
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

  const exitCompose = async () => {
      clearDraft();

      // if reply form is active, fade out and close the form by setting reply target to null
      if (replyTarget) {
          const [{}, setReplyTarget] = replyTarget;
          fadeOut(parent(ref), () => setReplyTarget(null));
      }

      // turn off edit mode if editing
      if (textToEdit) {
          const { setEditing } = textToEdit;
          setEditing(false);
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
        setInvalid();
        return;
    }

    // make a deep copy of existing comments
    let copy = [...comments];

    const commitChanges = () => {
      // commit the new list of comments to Context
      dispatch({ type: "SET_COMMENTS", comments: copy });
      // finally, reset after creating comment
      exitCompose();
    };

    // if in Edit Mode
    if (textToEdit) {
        const { comment: { id, replyingTo } } = textToEdit;

        // search through comments+replies, and replace the content
        copy = copy.map(entry => {
            // comment search
            if (entry.id === id)
                entry.content = draft;

            // reply search
            entry.replies.find(reply => {
                if (reply.id === id) {
                  reply.content = draft.replaceAll(`@${replyingTo}`, '').trim();;
                  return;
                }
            })

            return entry;
        });

        return commitChanges();
    }

    // For creating new comment...
    // initialize props for the new comment
    let newComment = {
      id: generateCommentID(),
      content: draft,
      createdAt: new Date(),
      score: 0,
      user: currentUser,
      replies: [],
    }; 

    // If in Reply Mode
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
        });

        setReplyTarget(null);
    }

    else
        copy = [...copy, newComment]

    commitChanges();
  };

  return (
    <div className='Compose'>
        <textarea ref={ref} placeholder='Add a comment...' value={draft} onChange={handleChange} onKeyDown={handleKeyDown} onBlur={handleBlur} />
        <img className='User' src={images[user]} alt={`photo of ${user}`} />

        <button onClick={addComment}>{buttonText || 'Send'}</button>
    </div>
  )
});
