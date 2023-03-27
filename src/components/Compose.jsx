import React from 'react'
import "../styles/Compose.sass";
import images from "../images.js";
import { useStateValue } from '../StateProvider';

export const Compose = () => {

  const [{currentUser}, dispatch] = useStateValue();

  if (!currentUser)
      return <h1>...</h1>

  const { username } = currentUser;

  return (
    <div className='Compose'>
        <textarea placeholder='Add a comment...' />
        <img src={images[username]} alt={`photo of ${username}`} />
        <button>Send</button>
    </div>
  )
}
