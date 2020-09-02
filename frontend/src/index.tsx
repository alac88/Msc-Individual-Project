import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import App from './App';
import './index.scss';

const history = createBrowserHistory();

ReactDOM.render(<App />, document.getElementById('root'));