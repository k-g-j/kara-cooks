import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { db } from './firebase.config';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);