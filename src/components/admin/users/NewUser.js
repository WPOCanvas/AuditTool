import React, { Component } from 'react';
import FormErrors from "../../FormErrors";
import Validate from "../../utility/FormValidation";
// import { Auth } from "aws-amplify";

class NewUser extends Component {
  state = {
    email: "",
    errors: {
      cognito: null,
      blankfield: false
    }
  };

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false
      }
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    // Form validation
    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
    }

    // AWS Cognito integration here
    try {
      // const user = await Auth.signIn(this.state.username, this.state.password);
      // console.log(user);
      // this.props.auth.setAuthStatus(true);
      // this.props.auth.setUser(user);
      this.props.history.push("/");
    }catch(error) {
      let err = null;
      !error.message ? err = { "message": error } : err = error;
      this.setState({
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });
    }
  };

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  };

  render() {
    return (
      <section className="section auth">
        <div className="container">
          <h1>Create a new user</h1>
          <FormErrors formerrors={this.state.errors} />

          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <p className="control">
                <input 
                  className="input" 
                  type="text"
                  id="email"
                  aria-describedby="emailHelp"
                  placeholder="Enter email of a New user"
                  value={this.state.email}
                  onChange={this.onInputChange}
                />
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-success">
                  New User
                </button>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default NewUser;