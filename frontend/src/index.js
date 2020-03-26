import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Game from './app';

const routing = (
  <Router>
    <div>
      <Route exact path="/" component={Game} />
    </div>
  </Router>
);
ReactDOM.render(routing, document.getElementById('root'));
