import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

import Home from '../Home';
import Message from '../Message';
import EmojiPicker from '../EmojiPicker';
import View from '../View';
import './App.scss';

const App = () => {
  const flow = useSelector(state => state.flow);
  const [message, setMessage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();

  const getTokenInUrl = () => {
    let token = window.location.pathname;
    return token.replace('/n/', '');
  }

  const [url, setUrl] = useState('/emojinote/' + getTokenInUrl());

  const fetchData = useCallback(() => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        dispatch({ type: 'LOAD_EMOJINOTE', message: json.note, emo: json.emoji });
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
        <Router>
          <Switch>
            <Route exact path='/'>
            {
              (flow === 'home' && <Home />)
              || (flow === 'message' && <Message />)
              || (flow === 'emopicker' && <EmojiPicker />)
              || (flow === 'view' && <View />)
            }
            </Route>
            <Route path='/n/:token'>
              {isFetching ? 'Fetching your emojicard' : <View />}
            </Route>
          </Switch>
        </Router>
      </header>
    </div>
  );

}

export default App;
