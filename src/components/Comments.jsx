import React, { useEffect, useRef, useState } from 'react';
import "../styles/Comments.sass";
import images from '../images';
import iconPlus from "../images/icon-plus.svg"
import iconMinus from "../images/icon-minus.svg"
import iconReply from "../images/icon-reply.svg"
import iconDelete from "../images/icon-delete.svg"
import iconEdit from "../images/icon-edit.svg"
import iconSave from "../images/icon-save.svg"
import { useStateValue } from '../StateProvider';
import { Modal } from './Modal';

export const Comments = ({refCompose}) => {
    const [{ currentUser, comments }, dispatch] = useStateValue();

    return (
      <div className='Comments'>
          {comments?.map((comment, i) => {
            const {user: { username }} = comment;
            const props = {
              comment: comment,
              editable: currentUser.username === username,
            };
            return <Comment key={i} comment={comment} editable={currentUser.username === username} refCompose={refCompose} />
          })}
      </div>
  );
};

export const Comment = ({comment, editable, refCompose}) => {
    const {id, user: {username}, createdAt, content, score, replies, replyingTo} = comment;

    const [{comments}, dispatch] = useStateValue();
    const [likes, setLikes] = useState(0);
    const [modal, setModal] = useState(null);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(content);
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
          }, 500); 
        },

        // removes the modal
        cancel: () => setModal(null)
      }

      // show the modal, with the defined actions
      setModal(<Modal action={action} />)
    };

    const editComment = (id) => {
      setEditing(!editing);

      // if editing and Save is clicked
      if (editing) {
          let copy = [...comments];

          // find by ID among comments and replace the content
          copy.find(comment => {
            if (comment.id === id) {
                comment.content = draft;
                return comment;
            }
            
            // also include nested replies
            comment.replies.find(reply => {
              if (reply.id === id) {
                  reply.content = draft;
                  return reply
              }
            });
          });

          // commit the new edit
          dispatch({ type: "SET_COMMENTS", comments: copy });
      } else {
          setDraft(content)
      }
    };

    const handleEdit = ({target: {value}}) => {
      console.log(value);
      setDraft(value);
    }

    const composeReply = (id, username) => {
      refCompose.current.scrollIntoView({ behavior: "smooth" });
      refCompose.current.value = `@${username} `;
      refCompose.current.focus();

      const replyTarget = {
        id: id,
        replyingTo: username,
      };

      dispatch({
        type: "SET_REPLY_DRAFT",
        replyTarget: replyTarget,
      });
    };

    return (
      <>
        <div ref={refComment} className='Comment'>
          <div className='Info'>
            <img className='Avatar' src={images[username]} alt={`photo of ${username}`} />
            <h1 className='Username'>{username}</h1>
            <p className='Time'>{createdAt}</p>
          </div>

          {editing ? <textarea className='Content_Edit' value={draft} onChange={handleEdit} /> 
            : <p className='Content'>
                <span>{replyingTo ? `@${replyingTo} ` : ''}</span>
                {content}
              </p>}

          <div className='Likes'>
            <img src={iconPlus} alt="plus icon" onClick={() => setLikes(score + 1)} />
            <p ref={refLikes}>{likes}</p>
            <img src={iconMinus} alt="plus icon" onClick={() => setLikes(score)} />
          </div>

          {editable ?
          <div className='Edit'>
            <button className='Button' onClick={() => showDeleteDialog(id)}><img src={iconDelete} alt="delete icon" />Delete</button>
            <button className='Button' onClick={() => editComment(id)}><img src={editing ? iconSave : iconEdit} alt="edit icon" />{editing ? 'Save' : 'Edit'}</button>
          </div> :
          <button className='Button' onClick={() => composeReply(id, username)} ><img src={iconReply} alt="reply icon" />Reply</button>}

          {modal}
        </div>
        
        {replies?.length ? <Replies replies={replies} refCompose={refCompose} /> : ''}
      </>
    );
};


export const Replies = ({replies, refCompose}) => {

  const [{currentUser}] = useStateValue();

  return (
    <div className='Replies'>
      {replies?.map((reply, i) => <Comment key={i} comment={reply} editable={currentUser.username === reply.user.username} refCompose={refCompose} />)}
    </div>
  );
};

export default Comments;