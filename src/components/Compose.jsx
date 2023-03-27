import React, { useEffect, useState } from 'react'
import "../styles/Compose.sass";
import images from "../images.js";
import { useStateValue } from '../StateProvider';

export const Compose = () => {

  const [{currentUser, comments}, dispatch] = useStateValue();
  const [draft, setDraft] = useState('');

  useEffect(() => {
    console.log(comments);
  }, [comments])

  if (!currentUser)
      return <h1>...</h1>

  const { username } = currentUser;

  const handleChange = ({target: {value}}) => {
      setDraft(value);
  };

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
    let comment = {
      id: generateCommentID(),
      content: draft,
      createdAt: 'Today',
      score: 0,
      user: currentUser,
      replies: [],
    }

    dispatch({
      type: "SET_COMMENTS",
      comments: [...comments, comment]
    });

    setDraft("");
  };

  return (
    <div className='Compose'>
        <textarea placeholder='Add a comment...' value={draft} onChange={handleChange} />
        <img src={images[username]} alt={`photo of ${username}`} />
        <button onClick={addComment}>Send</button>
    </div>
  )
}
