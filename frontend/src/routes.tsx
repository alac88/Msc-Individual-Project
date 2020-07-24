import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router';


const Home = lazy(() => import('./pages/Home'));
const Statistics = lazy(() => import('./pages/Statistics'));

const routes = () => (
  <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/statistics" component={Statistics} />
      </Switch>
  </Suspense>
);

export default routes;
