import "../styles/Modal.sass"

export const Modal = ({action}) => {
 
  // enable modal closing by clicking background overlay
  const handleClick = ({target, currentTarget}) => {
    if (target === currentTarget)
        action.cancel()
  };

  return (
    <div className='Overlay' onClick={(e) => handleClick(e)}>
        <div className='Modal'>
            <h1>Delete comment</h1>
            <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
            <button onClick={() => action.cancel()}>No, cancel</button>
            <button onClick={() => action.confirm()}>Yes, delete</button>
        </div>
    </div>
  ) 
}

export default Modal
