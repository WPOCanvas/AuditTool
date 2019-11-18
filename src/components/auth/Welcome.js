import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import { Spinner } from 'react-bootstrap';

class welcome extends Component {
  state = {
    code: "",
    username: "",
    loading: false,
    errors: {
      cognito: null,
      blankfield: false,
      passwordmatch: false
    }
  }

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false,
        passwordmatch: false
      }
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({loading: true});

    // Form validation
    this.clearErrorState();

    const code = this.state.code;
    const username = this.props.username ? this.props.username : this.state.username;
    try {
      await Auth.confirmSignUp( username , code);
      this.props.history.push("/");
    } catch (error) {
      let err = null;
      !error.message ? err = { "message": error } : err = error;
      this.setState({
        loading: false,
        errors: { ...this.state.errors, cognito: err }
      });
      console.log(err);
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
          <h1>Welcome!</h1>
          <p>You have successfully registered a new account.</p>
          <p>We&apos;ve sent you a email. Please click on the confirmation link to verify your account.</p>
          <form onSubmit={this.handleSubmit}>
          {this.props.username ? null : <div className="field">
              <p className="control">
                <input
                  className="input"
                  type="text"
                  id="username"
                  aria-describedby="codeHelp"
                  placeholder="Enter the username"
                  value={this.state.username}
                  onChange={this.onInputChange}
                />
              </p>
            </div>}
            <div className="field">
              <p className="control">
                <input
                  className="input"
                  type="text"
                  id="code"
                  aria-describedby="codeHelp"
                  placeholder="Enter the code"
                  value={this.state.code}
                  onChange={this.onInputChange}
                />
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
    )
  }

}

export default welcome;