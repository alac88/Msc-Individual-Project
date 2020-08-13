import React from 'react';
import { Route } from 'react-router';
import { BrowserRouter as Router } from "react-router-dom";

import Routes from './routes';

import './App.scss';

const RootComponentWithRoutes: React.FunctionComponent = () => (
    <Routes />
);

// const App: React.FunctionComponent<History> = ( history ) => (
const App: React.FunctionComponent =  () => (

    // <ConnectedRouter  history={history}>
        <Router>
            <Route path="/" component={RootComponentWithRoutes} />
            <div id="overlay"></div>
        </Router>
    
);

export default App;