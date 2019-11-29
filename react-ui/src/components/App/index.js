import React, { useCallback, useEffect, useState } from 'react';
import Message from '../Message';
import EmojiPicker from '../EmojiPicker';
import './App.scss';

const App = () => {
  const [message, setMessage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [url, setUrl] = useState('/api');

  const fetchData = useCallback(() => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        setMessage(json.message);
        setIsFetching(false);
      }).catch(e => {
        setMessage(`API call failed: ${e}`);
        setIsFetching(false);
      })
  }, [url]);

  useEffect(() => {
    setIsFetching(true);
    fetchData();
  }, [fetchData]);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <span role='img' aria-label='Love Letter'>💌 </span>
          <strong>EMOJI-NOTES</strong>
        </p>
        <small>2019 - <span role='img' aria-label='Robot'>🤖 </span>Created by regulardesigner</small>
        <Message />
        <EmojiPicker />
      </header>
    </div>
  );

}

export default App;
