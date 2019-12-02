import React from 'react';
import { useDispatch } from 'react-redux';

const Home = () => {
  const dispatch = useDispatch();
  return (
    <>
      <p>
          <span role='img' aria-label='Love Letter'>💌 </span>
          <strong>EMOJI-NOTES</strong>
      </p>
      <p><button className='btn' onClick={(event) => {dispatch({type: 'START', flow: 'message'})}}>Create an emoji-note</button></p>
      <small>2019 - <span role='img' aria-label='Robot'>🤖 </span>Created by regulardesigner</small>
    </>
  );
}

export default Home;
