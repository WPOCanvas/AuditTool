import React from 'react';
import { Route , Redirect } from 'react-router-dom';

export default function AuthenticatedRoute({ component: C, auth, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
            auth.isAuthenticated
            ? <C {...props} {...auth} />
            : <Redirect
                to={'/login'}
              />}
      />
    );
  }