import React from 'react';
import { useDispatch } from 'react-redux';

import './home.scss';

const Home = () => {
  const dispatch = useDispatch();
  return (
    <>
      <p>
          <span role='img' aria-label='Love Letter'>💌 </span>
          <strong>EMOJI-NOTES</strong>
      </p>
      <p className="baseline">Send little emoji-notes to your friends!</p>
      <button className='btn' onClick={(event) => {dispatch({type: 'START', flow: 'message'})}}>Create an emoji-note</button>
      <p className="btn-legend"><small>2019 - <span role='img' aria-label='Robot'>🤖 </span>Created by regulardesigner</small></p>
    </>
  );
}

export default Home;
