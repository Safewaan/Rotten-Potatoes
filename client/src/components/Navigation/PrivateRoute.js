import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import Reviews from '../Reviews';
import Landing from '../Landing';
import Search from '../Search';
import Recommendations from '../Recommendations';
import history from './history';

export default function PrivateRoute({
  //authenticated,
  //...rest
}) {
  return (

    <Router history={history}>
      <Switch>
        <Route path="/recommendations" exact component={Recommendations} />
        <Route path="/reviews" exact component={Reviews} />
        <Route path="/search" exact component={Search} />
        <Route path="/" exact component={Landing} />
      </Switch>
    </Router >
  );
}