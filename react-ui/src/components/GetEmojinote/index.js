import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

import './view.scss';

const GetEmojinotes = () => {
  const message = useSelector(state => state.message);
  const emo = useSelector(state => state.emo);

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
    <>
      <div className="view card">
        <span className="card-emoji" role="img" aria-label={emo}>{emoji(emo)}</span>
        <div className="card-message">
          {message}
        </div>
      </div>
      <Link className='btn' to='/'>Create your own Emojinotes</Link>
    </>
  );

}

export default GetEmojinotes;
