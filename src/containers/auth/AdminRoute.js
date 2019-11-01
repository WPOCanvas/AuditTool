import React from 'react';
import { Route , Redirect } from 'react-router-dom';
import Layout from '../../components/Layout';

export default function AuthenticatedRoute({ component: C, auth, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
            auth.isAuthenticated && auth.admin
            ? <Layout {...props} {...auth} > <C {...props} {...auth} /> </Layout> 
            : <Redirect
                to={'/'}
              />}
      />
    );
  }