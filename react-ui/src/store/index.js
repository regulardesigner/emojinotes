import { createStore, compose, applyMiddleware } from 'redux';

import reducer from './reducer';
import logMiddleware from './logMiddleware';
import noteMiddleware from './noteMiddleware';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancers = composeEnhancers(
  applyMiddleware(
    logMiddleware,
    noteMiddleware,
  ),
);

const store = createStore(
  reducer,
  // preloadedState,
  enhancers,
);

export default store;
