import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

// local import
// components:
import Home from '../Home';
import Message from '../Message';
import EmojiPicker from '../EmojiPicker';
import View from '../View';
import Preview from '../preview';
import GetEmojinotes from '../GetEmojinote';
// stylesheet:
import './App.scss';

const App = () => {
  const flow = useSelector(state => state.flow);
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='/new'>
          {
            (flow === 'home' && <Message />)
            || (flow === 'message' && <Message />)
            || (flow === 'emopicker' && <EmojiPicker />)
            || (flow === 'view' && <View />)
            || (flow === 'qr-code' && <Preview />)
          }
          </Route>
          <Route path='/n/:token'>
            <GetEmojinotes />
          </Route>
        </Switch>
      </Router>
    </div>
  );

}

export default App;
