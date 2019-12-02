import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './view.scss';

const App = () => {
  const message = useSelector(state => state.message);
  const emo = useSelector(state => state.emo);
  const dispatch = useDispatch();

  const emoji = (emoName) => {
    let result = '';
    switch (emoName) {
      case 'christmas tree':
        result = '🎄';
        break;
      case 'love letter':
        result = '💌';
        break;
      case 'heart eyes':
        result = '😍';
        break;
      case 'tears of joy':
        result = '😂';
        break;
      default:
        result = '🕴️';
    }
    return result;
  }

  return (
    <div className="view card">
      <span className="card-emoji" role="img" aria-label={emo}>{emoji(emo)}</span>
      <div className="card-message">
        {message}
      </div>
      <button onClick={(event) => console.log('SAVE')}>Save and share</button>
    </div>
  );

}

export default App;
