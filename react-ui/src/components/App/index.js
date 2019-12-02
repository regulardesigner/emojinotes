import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Home from '../Home';
import Message from '../Message';
import EmojiPicker from '../EmojiPicker';
import './App.scss';

const App = () => {
  const flow = useSelector(state => state.flow);
  const dispatch = useDispatch();

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
        {
          (flow === 'home' && <Home />)
          || (flow === 'message' && <Message />)
          || (flow === 'emopicker' && <EmojiPicker />)
        }
      </header>
    </div>
  );

}

export default App;
