import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import './home.scss';

const Home = () => {
  const dispatch = useDispatch();
  return (
    <>
      <h1 className="title">
          <span role='img' aria-label='Love Letter'>💌 </span>
          <strong>EMOJI-NOTES</strong>
      </h1>
      <p className="baseline">Send nice messages to your friends!</p>
      <Link
        to='/new'
        className='btn'
        onClick={(event) => {dispatch({type: 'START', flow: 'message'})}}
      >Create an emoji-note today!
      </Link>
      <p className="btn-legend"><small>2022 - <span role='img' aria-label='Robot'>🤖 </span>Created by regulardesigner</small></p>
    </>
  );
}

export default Home;
