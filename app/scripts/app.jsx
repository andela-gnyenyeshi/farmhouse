(function() {
  'use strict';
  let React = require('react'),
  ReactDOM = require('react-dom'),
  ReactRouter = require('react-router'),
  Route = require('react-router').Route,
  browserHistory = ReactRouter.browserHistory,
  Router = ReactRouter.Router,
  Redirect = ReactRouter.Redirect,
  IndexRoute = ReactRouter.IndexRoute,
  Landing = require('./components/Landing/Landing.jsx');

  ReactDOM.render((
    <Router history={browserHistory}>
      <Route path="/" component={Landing}>
      </Route>
    </Router>
  ), document.getElementById('ui'));
})();
