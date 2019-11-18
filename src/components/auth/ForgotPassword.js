import React, { Component } from 'react';
import FormErrors from "../FormErrors";
import Validate from "../utility/FormValidation";
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { Spinner } from 'react-bootstrap';

class ForgotPassword extends Component {
  state = {
    email: "",
    loading: false,
    errors: {
      cognito: null,
      blankfield: false
    }
  }

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false
      }
    });
  }

  forgotPasswordHandler = async event => {
    event.preventDefault();
    this.setState({loading: true});
    // Form validation
    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        loading: false,
        errors: { ...this.state.errors, ...error }
      });
    }

    try {
      await Auth.forgotPassword(this.state.email);
      this.props.history.push('/forgotpasswordverification');
    }catch(error) {
      console.log(error);
    }
  }

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  }

  render() {
    return (
      !this.state.loading ?
      <section className="section auth">
        <div className="container">
          <h1>Forgot your password?</h1>
          <p>
            Please enter the email address associated with your account and we&apos;ll
            email you a password reset link.
          </p>
          <FormErrors formerrors={this.state.errors} />

          <form onSubmit={this.forgotPasswordHandler}>
            <div className="field">
              <p className="control has-icons-left has-icons-right">
                <input
                  type="email"
                  className="input"
                  id="email"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                  value={this.state.email}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <Link to="/forgotpassword">Forgot password?</Link>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-success">
                  Submit
                </button>
              </p>
            </div>
          </form>
        </div>
      </section>
      :
      <Spinner />
    );
  }
}

export default ForgotPassword;