import React, { createRef, useEffect, useRef, useState } from 'react';
import images from '../images';
import iconDelete from "../images/icon-delete.svg";
import iconEdit from "../images/icon-edit.svg";
import iconMinus from "../images/icon-minus.svg";
import iconPlus from "../images/icon-plus.svg";
import iconReply from "../images/icon-reply.svg";
import { useStateValue } from '../StateProvider';
import "../styles/Comments.sass";
import { fadeOut, getTimeStamp, parent } from '../utils';
import { Compose } from "./Compose";
import { Modal } from './Modal';

export const Comments = () => {
    const [{ currentUser, comments }, dispatch] = useStateValue(); 

    // const sorted = comments.sort((a, b) => a.score < b.score);
    useEffect(() => {
      dispatch({
        type: "SET_COMMENTS",
        comments: comments?.sort((a, b) => a.score < b.score)
      });
    }, [comments]);

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
    const {id, user: {username}, createdAt, content, score, scoreGiven, replies, replyingTo} = comment;

    const [{currentUser, comments}, dispatch] = useStateValue();
    const [likes, setLikes] = useState(0);
    const [modal, setModal] = useState(null);
    const [editing, setEditing] = useState(false);
    const [replyTarget, setReplyTarget] = useState(null);
    const [timestamp, setTimeStamp] = useState('');

    const refLikes = useRef(null);
    const refComment = useRef(null);
    const refCompose = createRef();

    // setup dynamic timestamps
    useEffect(() => {
      const date = Date.parse(createdAt);

      if (!date) {
          setTimeStamp(createdAt);
          return;
      }

      setTimeStamp(getTimeStamp(date));
      
      const interval = setInterval(() => {
        setTimeStamp(getTimeStamp(date));
      }, 10000);

      return () => clearInterval(interval);
    }, [createdAt])

    useEffect(() => {
      setLikes(score);
    }, [score]);

    // trigger pop animation when like count changes
    useEffect(() => {
      const timeout = setTimeout(() => {
        refLikes.current.style.animationName = "";
      }, 500);

      return () => clearTimeout(timeout);
    }, [likes, refLikes]);

    const updateLikes = (amount) => {

      if (scoreGiven === amount)
          return
      else
          refLikes.current.style.animationName = "pop";

      let copy = [...comments];
      copy = copy.map(comment => {
        if (comment.id === id) {
            comment.score = likes + amount;
            comment.scoreGiven = scoreGiven ? scoreGiven + amount : amount;
        }

        comment.replies.find(reply => {
            if (reply.id === id) {
                reply.score = likes + amount;
                reply.scoreGiven = scoreGiven ? scoreGiven + amount : amount;
            }
        });

        return comment;
      });

      dispatch({
        type: 'SET_COMMENTS',
        comments: copy,
      });
    };

    const showDeleteDialog = (id) => {
      // setup modal actions
      const action = {
        confirm: () => {
          // filter out the ID marked for deletion
          let copy = [...comments];

          copy = copy.filter(comment => {
            let replies = comment.replies.filter(reply => reply.id !== id);
            comment.replies = replies;
            return comment.id !== id
          });

          // set opacity to 0, trigger transition for fade out effect
          refComment.current.style.opacity = 0;

          // add a tiny delay to match fade out effect
          setTimeout(() => {
            refComment.current.style.opacity = 1;
            dispatch({
              type: "SET_COMMENTS",
              comments: copy,
            });

            setModal(null);
          }, 500); 
        },

        // removes the modal
        cancel: () => setModal(null)
      }

      // show the modal, with the defined actions
      setModal(<Modal action={action} />)
    };

    const toggleEditForm = () => {
      setEditing(!editing);
    };
    
    const toggleReplyForm = (id, username) => {
      
      if (replyTarget)
          fadeOut(parent(refCompose), () => setReplyTarget(null))
          
      else
          setReplyTarget({ id: id, username: username })
    };

    const setLikesColor = () => {
      if (!Math.abs(scoreGiven) || scoreGiven === 0)
          return 'unset';

      return scoreGiven > 0 ? 'hsl(142, 79%, 45%)' : 'hsl(10, 95%, 60%)';
    };

    return (
      <>
        <div ref={refComment} className='Comment'>
          <div className='Info'>
            <img className='Avatar' src={images[username]} alt={`photo of ${username}`} />
            <h1 className='Username'>
                {username} 
                {username === currentUser.username && <span className='You'>you</span>}
            </h1>
            <p className='Time'>{`${timestamp}`}</p>
          </div>

          {editing ? <Compose ref={refCompose} buttonText="Update" textToEdit={{ comment, setEditing }} />
            : <p className='Content'>
                <span>{replyingTo ? `@${replyingTo} ` : ''}</span>
                {content}
              </p>}

          <div className='Likes'>
            <img src={iconPlus} alt="plus icon" onClick={() => updateLikes(1)} />
            <p ref={refLikes} style={{ color: setLikesColor() }}>{likes}</p>
            <img src={iconMinus} alt="plus icon" onClick={() => updateLikes(-1)} />
          </div>

          {editable ?
          <div className='Edit'>
            <button className='Button' onClick={() => showDeleteDialog(id)}><img src={iconDelete} alt="delete icon" />Delete</button>
            <button className='Button' onClick={() => toggleEditForm(id)}><img src={iconEdit} alt="edit icon" />Edit</button>
          </div> :
          <button className='Button' onClick={() => toggleReplyForm(id, username)} ><img src={iconReply} alt="reply icon" />Reply</button>}

          {modal}
        </div>

        {replyTarget && <Compose ref={refCompose} buttonText="Reply" replyTarget={[replyTarget, setReplyTarget]} />}
        
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