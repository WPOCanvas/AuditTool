import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Auth } from 'aws-amplify';

const style = {
  style : {
    "boxShadow": "0 0.5em 1em -0.125em rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.02)"
  }
}
export default class Navbar extends Component {
  handleLogOut = async event => {
    event.preventDefault();
    try {
      Auth.signOut();
      this.props.auth.setAuthStatus(false);
      this.props.auth.setUser(null);
    }catch(error) {
      console.log(error.message);
    }
    return;
  }
  render() {
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation" style={style.style}>
        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <Link to="/" className="navbar-item ">
              Home
            </Link>
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              {this.props.auth.isAuthenticated && this.props.auth.user && (
                <p>
                  {this.props.auth.user.username}
                </p>
              )}
              <div className="buttons">
                {!this.props.auth.isAuthenticated && (
                  <div>
                    <Link to="/register" className="button is-primary">
                      <strong>Register</strong>
                    </Link>
                    <Link to="/welcome" className="button is-info">
                      verify
                    </Link>
                    <Link to="/login" className="button is-light">
                      Log in
                    </Link>
                  </div>
                )}
                {this.props.auth.isAuthenticated && (
                  <div>
                    <Link to="/newUser" className="button is-primary">
                      New User
                    </Link>
                    <Link to="/" onClick={this.handleLogOut} className="button is-light">
                      Log out
                  </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }
}
