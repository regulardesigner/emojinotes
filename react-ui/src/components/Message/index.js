import React, { useState } from 'react';
import './message.scss';

const Message = () => {
  const [message, setMessage] = useState("Coucou,")
  return (
    <div className="message">
      <p>Write your message</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          console.log({message})
        }}>
        <textarea
          onChange={(event) => {setMessage(event.target.value)}}
          value={message}
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
