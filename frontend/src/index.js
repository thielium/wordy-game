import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Game from './app';
import Users from './wordList';

const routing = (
  <Router>
    <div>
      <Route exact path="/" component={Game} />
      <Route path="/words" component={Users} />
    </div>
  </Router>
);
ReactDOM.render(routing, document.getElementById('root'));
