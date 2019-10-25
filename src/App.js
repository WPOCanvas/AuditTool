import React, { Component } from 'react';
import { BrowserRouter as Router, Switch , Route} from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import LogIn from './components/auth/LogIn';
import Register from './components/auth/Register';
import 'bootstrap/dist/css/bootstrap.min.css';

import ForgotPassword from './components/auth/ForgotPassword';
import ForgotPasswordVerification from './components/auth/ForgotPasswordVerification';
import ChangePassword from './components/auth/ChangePassword';
import ChangePasswordConfirm from './components/auth/ChangePasswordConfirm';
import Welcome from './components/auth/Welcome';
import Footer from './components/Footer';
import UserAudit from './components/UserAudit';
import AuditQues from './components/auditing/AuditQues';
import { Auth } from 'aws-amplify';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import NewUser from './components/admin/users/NewUser';
import NewProduct from './components/admin/products/newProduct';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import AuthenticatedRoute from './containers/auth/AuthenticatedRoute';
import UnauthenticatedRoute from './containers/auth/UnauthenticatedRoute';

Amplify.configure(awsconfig);
library.add(faEdit);

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
      const session = await Auth.currentSession();
      this.setAuthStatus(true);
      console.log(session);
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
      user: this.state.user,
      setAuthStatus: this.setAuthStatus,
      setUser: this.setUser
    }
    return (
      !this.state.isAuthenticating &&
      <div className="App">
        <Router>
          <div>
            <Navbar auth={authProps} />
            <Switch>
              <Route exact path="/" component={Home} auth={authProps} />
              <UnauthenticatedRoute exact path="/login" component={LogIn} {...this.props} auth={authProps}  />
              <UnauthenticatedRoute exact path="/register" component={Register} {...this.props} auth={authProps} />
              <UnauthenticatedRoute exact path="/forgotpassword" component={ForgotPassword} {...this.props} auth={authProps} />
              <UnauthenticatedRoute exact path="/forgotpasswordverification" component={ForgotPasswordVerification} {...this.props} auth={authProps} />
              <UnauthenticatedRoute exact path="/changepassword" component={ChangePassword} {...this.props} auth={authProps} />
              <UnauthenticatedRoute exact path="/changepasswordconfirmation" component={ChangePasswordConfirm} {...this.props} auth={authProps} />
              <UnauthenticatedRoute exact path="/welcome" component={Welcome} {...this.props} auth={authProps} />
              <AuthenticatedRoute exact path="/newUser" component={NewUser} {...this.props} auth={authProps} />
              <AuthenticatedRoute exact path="/newProduct" component={NewProduct} {...this.props} auth={authProps} />
              <AuthenticatedRoute exact path="/userAudit" component={UserAudit} {...this.props} />
              <AuthenticatedRoute exact path="/auditQues" component= {AuditQues} {...this.props} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </div>
    );
  }
}
          
export default App;
