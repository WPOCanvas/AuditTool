import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Auth } from 'aws-amplify';
import {  MdHome } from "react-icons/md";
import { FaUsersCog } from "react-icons/fa";

const style = {
  style: {
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
    } catch (error) {
      console.log(error.message);
    }
    return;
  }
  render() {
    return (
      <nav className="navbar" role="navigation" aria-label="main navigation" style={style.style}>
        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <div className="buttons">
              {this.props.auth.isAuthenticated && (
                <div>
                <Link to="/" className="button is-light">
                  <MdHome/>
                  <div style={{padding:'5px'}}>Home</div>
                    
              </Link>
                  <Link to="/newUser" className="button is-light">
                  <FaUsersCog/>

                   <div style={{padding:'5px'}}>Administration</div>
              </Link>
                </div>
              )}
            </div>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              {this.props.auth.isAuthenticated && this.props.auth.user && (
                <span style={{ textTransform: 'capitalize' }}>
                  {this.props.auth.user.username}
                </span>
              )}
            </div>
            <div className="navbar-item has-dropdown is-hoverable ">
              <Link to="" className="navbar-link">
              </Link>
              <div className="navbar-dropdown is-right">
                {!this.props.auth.isAuthenticated && (
                  <div>
                    <Link to="/welcome" className="navbar-item">
                      verify
                    </Link>
                    <Link to="/login" className="navbar-item">
                      Log in
                  </Link>
                  </div>
                )}
                {this.props.auth.isAuthenticated && (
                  <div style={{ paddingLeft: '10px' }}>
                    <Link to="/login" onClick={this.handleLogOut} className="navbar-item">
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
