import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './message.scss';

const Message = () => {
  // const [message, setMessage] = useState('');
  const message = useSelector(state => state.message);
  const messageCounterClass = 'message-counter';
  const messageCounterClassRed = 'message-counter--oversize';
  const dispatch = useDispatch();
  return (
    <>
      <div className="message">
        <p>Write your message</p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if(message.length <= 150 ) {
              dispatch({ type: 'SAVE_MESSAGE', flow: 'emopicker'});
            } else {
              // alert('Sorry your message is too long...');
              // @TODO: use a toaster to show the message
            }
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
          <div className={message.length < 150 ? messageCounterClass : messageCounterClassRed}>{message.length}/150</div>
          <button className='btn' type='submit'>Done</button>
          <p className="btn-legend"><small>Next, you'll pick an emoji! <span role='img' aria-label='Happy Face'>😊</span></small></p>
        </form>
      </div>
      <div className={message.length < 150 ? 'toast' : 'toast show'}><span role="img" aria-label="warning message too long">🚨</span> Your message is too long.</div>
    </>
  );
}

export default Message;
