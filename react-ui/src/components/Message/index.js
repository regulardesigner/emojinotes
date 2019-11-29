import React from 'react';
import './message.scss';

const Message = () => {
  return (
    <div className="message">
      <p>Write your message</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          console.log(event.target.message.value)
        }}>
        <textarea
          className="message-textarea"
          name="message"
          cols="50"
          rows="8"
        >
        </textarea>
        <button className='btn' type='submit'>Submit</button>
      </form>
    </div>
  );
}

export default Message;
