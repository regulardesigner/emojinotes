import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

// local import
// components:
import Home from '../Home';
import New from '../New';
import GetEmojinotes from '../GetEmojinote';
// stylesheet:
import './App.scss';

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={ <Home/> } />
          <Route path='/new' element= { <New/> } />
          <Route path='/n/:token' element={ <GetEmojinotes /> } />
        </Routes>
      </Router>
    </div>
  );

}

export default App;
