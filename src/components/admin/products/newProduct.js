import React, { Component } from 'react';
import FormErrors from "../../FormErrors";
import Validate from "../../utility/FormValidation";
// import { Auth } from "aws-amplify";

import Select from 'react-select';

const options = [
    { value: 'chocolate', label: 'Chocolate' , edit: false },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

class NewProduct extends Component {
    state = {
        pk: "",
        sk: "",
        name: "",
        selectedUsers: null,
        users: [],
        errors: {
            cognito: null,
            blankfield: false
        }
    };

    handleChange = selectedOption => {
        this.setState({ selectedOption });
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
            // this.props.history.push("/");
            console.log(event.data, this.state.users)
        } catch (error) {
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
        const { selectedOption } = this.state;
        return (
            <section className="section auth">
                <div className="container">
                    <h1>Create a new product</h1>
                    <FormErrors formerrors={this.state.errors} />

                    <form onSubmit={this.handleSubmit}>
                        <div className="field">
                            <p className="control">
                                <input
                                    className="input"
                                    type="text"
                                    id="name"
                                    aria-describedby="productHelp"
                                    placeholder="product"
                                    value={this.state.name}
                                    onChange={this.onInputChange}
                                />
                            </p>
                        </div>
                        <div className="field">
                            <Select
                                isMulti = {true}
                                value={selectedOption}
                                onChange={this.handleChange}
                                options={options}
                                placeholder={'add new users'}
                            />
                        </div>
                        <div className="field">
                            <p className="control">
                                <button className="button is-success">
                                    New Product
                                </button>
                            </p>
                        </div>
                    </form>

                </div>
            </section>
        );
    }
}

export default NewProduct;
