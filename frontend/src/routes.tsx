import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';


const Home = lazy(() => import('./pages/Home'));
const Statistics = lazy(() => import('./pages/Statistics'));
const Readme = lazy(() => import('./pages/Readme'));

const routes = () => (
  <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/statistics" component={Statistics} />
        <Route path="/readme" component={Readme} />
      </Switch>
  </Suspense>
);

export default routes;
