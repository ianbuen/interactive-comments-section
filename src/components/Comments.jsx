import React, { useEffect, useRef, useState } from 'react';
import "../styles/Comments.sass";
import images from '../images';
import iconPlus from "../images/icon-plus.svg"
import iconMinus from "../images/icon-minus.svg"
import iconReply from "../images/icon-reply.svg"
import iconDelete from "../images/icon-delete.svg"
import iconEdit from "../images/icon-edit.svg"
import { useStateValue } from '../StateProvider';

export const Comments = () => {

    const [{ currentUser, comments }, dispatch] = useStateValue();

    return (
      <div className='Comments'>
          {comments?.map((comment, i) => {
            const {user: { username }} = comment;
            return <Comment key={i} comment={comment} editable={currentUser === username} />
          })}
      </div>
  );
};


export const Comment = ({comment, editable}) => {
    const [{currentUser}] = useStateValue();
    const {user: {image, username}, createdAt, content, score, replies} = comment;

    const [likes, setLikes] = useState(0);
    const refLikes = useRef(null);

    useEffect(() => {
      setLikes(score);
    }, [score]);

    // trigger pop animation when like count changes
    useEffect(() => {
      refLikes.current.style.animationName = "pop";

      const timeout = setTimeout(() => {
        refLikes.current.style.animationName = "";
      }, 500);

      return () => clearTimeout(timeout);
    }, [likes, refLikes]);

    return (
      <>
        <div className='Comment'>
          <div className='Info'>
            <img className='Avatar' src={images[username]} alt={`photo of ${username}`} />
            <h2 className='Username'>{username}</h2>
            <p className='Time'>{createdAt}</p>
          </div>

          <p className='Content'>{content}</p>

          <div className='Actions'>
            <div className='Likes'>
              <img src={iconPlus} alt="plus icon" onClick={() => setLikes(score + 1)} />
              <p ref={refLikes}>{likes}</p>
              <img src={iconMinus} alt="plus icon" onClick={() => setLikes(score)} />
            </div>

            {editable ?
                  <div className='Edit'>
                    <button className='Button'><img src={iconDelete} alt="delete icon" />Delete</button>
                    <button className='Button'><img src={iconEdit} alt="edit icon" />Edit</button>
                  </div>
              :   <button className='Button'><img src={iconReply} alt="reply icon" />Reply</button>}
          </div>

        </div>
        
        {replies?.length ? <Replies replies={replies} /> : ''}
      </>
    );
};


export const Replies = ({replies}) => {

  const [{currentUser}] = useStateValue();

  return (
    <div className='Replies'>
      {replies?.map((reply, i) => <Comment key={i} comment={reply} editable={currentUser === reply.user.username} />)}
    </div>
  );
};

export default Comments;