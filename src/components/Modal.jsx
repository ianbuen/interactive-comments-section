import "../styles/Modal.sass"

export const Modal = ({action}) => {

  return (
    <div className='Overlay' onClick={() => action.cancel()}>
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
