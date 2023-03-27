import React, { useEffect, useRef, useState } from 'react';
import "../styles/Comments.sass";
import images from '../images';
import iconPlus from "../images/icon-plus.svg"
import iconMinus from "../images/icon-minus.svg"
import iconReply from "../images/icon-reply.svg"
import iconDelete from "../images/icon-delete.svg"
import iconEdit from "../images/icon-edit.svg"
import { useStateValue } from '../StateProvider';
import { Modal } from './Modal';

export const Comments = () => {
  const [{ currentUser, comments }, dispatch] = useStateValue();

    return (
      <div className='Comments'>
          {comments?.map((comment, i) => {
            const {user: { username }} = comment;
            return <Comment key={i} comment={comment} editable={currentUser.username === username} />
          })}
      </div>
  );
};


export const Comment = ({comment, editable}) => {
    const {id, user: {username}, createdAt, content, score, replies} = comment;

    const [{comments}, dispatch] = useStateValue();
    const [likes, setLikes] = useState(0);
    const [modal, setModal] = useState(null);
    const refLikes = useRef(null);
    const refComment = useRef(null);

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


    const showDeleteDialog = (id) => {
      // setup modal actions
      const action = {
        confirm: () => {
          // filter out the ID marked for deletion
          let copy = [...comments];

          copy.filter(comment => {
            let replies = comment.replies.filter(reply => reply.id !== id);
            comment.replies = replies;
            return comment.id !== id
          });

          // set opacity to 0, trigger transition for fade out effect
          refComment.current.style.opacity = 0;

          setTimeout(() => {
            dispatch({
              type: "SET_COMMENTS",
              comments: copy,
            });
          }, 500); 
        },

        // removes the modal
        cancel: () => setModal(null)
      }

      // show the modal, with the defined actions
      setModal(<Modal action={action} />)
    };

    return (
      <>
        <div ref={refComment} className='Comment'>
          <div className='Info'>
            <img className='Avatar' src={images[username]} alt={`photo of ${username}`} />
            <h1 className='Username'>{username}</h1>
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
                    <button className='Button' onClick={() => showDeleteDialog(id)}><img src={iconDelete} alt="delete icon" />Delete</button>
                    <button className='Button'><img src={iconEdit} alt="edit icon" />Edit</button>
                  </div>
              :   <button className='Button'><img src={iconReply} alt="reply icon" />Reply</button>}
          </div>

          {modal}
        </div>
        
        {replies?.length ? <Replies replies={replies} /> : ''}
      </>
    );
};


export const Replies = ({replies}) => {

  const [{currentUser}] = useStateValue();

  return (
    <div className='Replies'>
      {replies?.map((reply, i) => <Comment key={i} comment={reply} editable={currentUser.username === reply.user.username} />)}
    </div>
  );
};

export default Comments;