import React from 'react';
import './emojipicker.scss';

const EmojiPicker = () => {
  return (
    <div className="emo-picker">
      <p>Choose your emoji</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          console.log(event.target.emo_picker.value)
        }}>
        <label htmlFor="tears-of-joy">
            <input type="radio" name='emo_picker' className='emo-picker-tears-of-joy' value='tears of joy' id='tears-of-joy'/>
            <span role='img' aria-label='Face With Tears of Joy'>😂</span>
        </label>
        <label htmlFor="love">
            <input type="radio" name='emo_picker' className='emo-picker-love' value='love' id='love'/>
            <span role='img' aria-label='love'>❤️</span>
        </label>
        <label htmlFor="heart-eyes">
            <input type="radio" name='emo_picker' className='emo-picker-heart-eyes' value='heart eyes' id='heart-eyes'/>
            <span role='img' aria-label='Smiling Face With Heart-Eyes'>😍</span>
        </label>
        <button className='btn' type='submit'>Save your message</button>
      </form>
    </div>
  );
}

export default EmojiPicker;
