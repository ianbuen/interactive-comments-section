import React from 'react';
import "../styles/Comments.sass";
import images from '../images';

export const Comments = ({data}) => {
    const {comments} = data;
    
    return (
      <div className='Comments'>
          {comments?.map((comment, i) => (
              <Comment key={i} comment={comment} />
          ))}
      </div>
  );
};


export const Comment = ({comment}) => {
    const {user: {image, username}, createdAt, content, score} = comment;

    console.log(image.webp);

    return (
      <div className='Comment'>
          <div className='Info'>
            <img className='Avatar' src={images[username]} alt={`photo of ${username}`} />
            <h2 className='Username'>{username}</h2>
            <p className='Time'>{createdAt}</p>
          </div>

          <p className='Content'>{content}</p>

          <div className='Actions'>
            
          </div>
      </div>
    );
};

export default Comments;