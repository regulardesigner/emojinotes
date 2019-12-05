import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './message.scss';

const Message = () => {
  // const [message, setMessage] = useState('');
  const message = useSelector(state => state.message);
  const dispatch = useDispatch();
  return (
    <div className="message">
      <p>Write your message</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          dispatch({ type: 'SAVE_MESSAGE', flow: 'emopicker'});
          console.log({message});
        }}>
        <textarea
          onChange={(event) => {dispatch({ type: 'WRITE_MESSAGE', message: event.target.value})}}
          value={message}
          className="message-textarea"
          name="message"
          cols="50"
          rows="8"
        >
        </textarea>
        <div className="message-counter">{message.length}/200</div>
        <button className='btn' type='submit'>Done</button>
        <p className="btn-legend"><small>Next, you'll pick an emoji! <span role='img' aria-label='Happy Face'>😊</span></small></p>
      </form>
    </div>
  );
}

export default Message;
