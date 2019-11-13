import React from 'react';
import { Route , Redirect } from 'react-router-dom';
import Layout from '../../components/Layout';

export default ({ component: C, auth, ...rest }) =>
  <Route
    {...rest}
    render={props =>
      !auth.isAuthenticated
        ? <Layout {...props} {...auth} > <C {...props} {...auth} /> </Layout>
        : <Redirect to="/login" />}
  />;