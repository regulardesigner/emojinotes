import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const App = () => {
  const message = useSelector(state => state.message);
  const emo = useSelector(state => state.emo);
  const dispatch = useDispatch();
  return (
    <div className="view">
      <pre>
        View
        message: {message}
        emo: {emo}
      </pre>
      <button onClick={(event) => console.log('SAVE')}>Save and share</button>
    </div>
  );

}

export default App;
