import React, { Component } from 'react';
import { BrowserRouter as Router, Switch , Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import LogIn from './components/auth/LogIn';
import Register from './components/auth/Register';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

import ForgotPassword from './components/auth/ForgotPassword';
import ForgotPasswordVerification from './components/auth/ForgotPasswordVerification';
import ChangePassword from './components/auth/ChangePassword';
import ChangePasswordConfirm from './components/auth/ChangePasswordConfirm';
import Welcome from './components/auth/Welcome';
import Footer from './components/Footer';
import AuditQues from './components/auditing/AuditQues';
import { Auth } from 'aws-amplify';
import NewUser from './components/admin/users/NewUser';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import AuthenticatedRoute from './containers/auth/AuthenticatedRoute';
import UnauthenticatedRoute from './containers/auth/UnauthenticatedRoute';
import AdminRoute from './containers/auth/AdminRoute';
import NotFound from './components/notFound';
import AllAudits from './components/auditing/AllAudits';
import OverRoll from './components/auditing/OverRoll';
import PerformAudit from './components/auditing/PerformAudit';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
 
library.add(faCheck)

Amplify.configure(awsconfig);

class App extends Component {

  state = {
    isAuthenticated: false,
    isAuthenticating: true,
    user: null
  }

  setAuthStatus = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  setUser = user => {
    this.setState({ user: user.user });
  }

  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.setAuthStatus(true);
      const user = await Auth.currentAuthenticatedUser();
      this.setUser({ user });
    } catch (error) {
      if (error !== 'No current user') {
        console.log(error);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  render() {
    const authProps = {
      isAuthenticated: this.state.isAuthenticated,
      setAuthStatus: this.setAuthStatus,
      setUser: this.setUser,
      user: this.state.user,
      admin: this.state.user ? this.state.user.attributes['custom:admin'] : null,
    }
    return (
      !this.state.isAuthenticating &&
      <div>
        <Router>
          <div>
            <Navbar auth={authProps} />
            <Switch>
              <AuthenticatedRoute exact path="/" component= {AllAudits} {...this.props}  auth={authProps} />
              <UnauthenticatedRoute exact path="/login" component={LogIn} {...this.props} auth={authProps}  />
              <UnauthenticatedRoute exact path="/register" component={Register} {...this.props} auth={authProps} />
              <UnauthenticatedRoute exact path="/forgotpassword" component={ForgotPassword} {...this.props} auth={authProps} />
              <UnauthenticatedRoute exact path="/forgotpasswordverification" component={ForgotPasswordVerification} {...this.props} auth={authProps} />
              <UnauthenticatedRoute exact path="/changepassword" component={ChangePassword} {...this.props} auth={authProps} />
              <UnauthenticatedRoute exact path="/changepasswordconfirmation" component={ChangePasswordConfirm} {...this.props} auth={authProps} />
              <UnauthenticatedRoute exact path="/welcome" component={Welcome} {...this.props} auth={authProps} />
              <AdminRoute exact path="/newUser" component={NewUser} {...this.props} auth={authProps} />
              <AuthenticatedRoute exact path="/auditQues/:id" component= {AuditQues} {...this.props}  auth={authProps} />
              <AuthenticatedRoute exact path="/OverRoll/:id" component= {OverRoll} {...this.props}  auth={authProps} />
              <AuthenticatedRoute exact path="/PerformAudit" component= {PerformAudit} {...this.props}  auth={authProps} />
              <Route component={NotFound} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </div>
    );
  }
}
          
export default App;

// <AdminRoute exact path="/newProduct" component={NewProduct} {...this.props} auth={authProps} />
// <AuthenticatedRoute exact path="/product" component={ProductList} {...this.props} auth={authProps} />
// <AuthenticatedRoute exact path="/product/:id" component={SingleProduct} {...this.props} auth={authProps} />
// <AuthenticatedRoute exact path="/userAudit" component={UserAudit} {...this.props} auth={authProps} />