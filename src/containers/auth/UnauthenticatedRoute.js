import React from 'react';
import { Route , Redirect } from 'react-router-dom';

export default ({ component: C, auth, ...rest }) =>
  <Route
    {...rest}
    render={props =>
      !auth.isAuthenticated
        ? <C {...props} {...auth} />
        : <Redirect to="/" />}
  />;