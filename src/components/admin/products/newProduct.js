import React, { Component } from 'react';
import FormErrors from "../../FormErrors";
import Validate from "../../utility/FormValidation";
import { API } from "aws-amplify";

import Select from 'react-select';
import Spinner from '../../utility/Spinner';

class NewProduct extends Component {
    state = {
        name: "",
        selectedUsers: null,
        loading: false,
        users: [],
        productList: [],
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

    handleChange = selectedUsers => {
        this.setState({ selectedUsers });
    };

    onInputChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
        document.getElementById(event.target.id).classList.remove("is-danger");
    };

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({loading: true});

        // Form validation
        this.clearErrorState();
        const error = Validate(event, this.state);
        if (error) {
            this.setState({
                errors: { ...this.state.errors, ...error }
            });
        }

        const userList = this.state.selectedUsers.map(({value}) => value);
        try {
            await API.post("ProductApi", "/products", {
                body: {
                    pk: "Product",
                    sk: "Org-" + this.props.user.attributes['custom:organization'] +'-'+  Date.now().toString(),
                    name: this.state.name,
                    users: userList
                }
            });
            this.setState({ selectedUsers: null, name: "" , loading: false });
            this.fetchProductList();
        } catch (error) {
            let err = null;
            !error.message ? err = { "message": error } : err = error;
            this.setState({
                loading: false ,
                errors: {
                    ...this.state.errors,
                    cognito: err
                }
            });
        }
    };

    async fetchProductList() {
        this.setState({loading: true});
        const orgData = 'Org-'+this.props.user.attributes['custom:organization'];
        try {
            const response = await API.get("ProductApi", "/products/Product/" + orgData);
            this.setState({ productList: [...response] });
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
        this.setState({loading: false});
    }

    async fetchUserList() {
        this.setState({loading: true});
        const orgData = 'Org-'+this.props.user.attributes['custom:organization'];
        try {
            const response = await API.get("UserApi", "/users/User/"+orgData);
            const options = response.map( item => {
               return { value: item.email ,
                label: item.email.split('@')[0] }
            });
            this.setState({users: options})
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
        this.setState({loading: true});
    }

    async componentDidMount() {
        await this.fetchProductList();
        await this.fetchUserList();
    }

    render() {
        const {selectedUsers} = this.state;
        return (
            <section className="section auth">
                <div className="container">
                    <h1>Create a new product</h1>
                    <FormErrors formerrors={this.state.errors} />
                    {
                        !this.state.loading ? (
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
                                isMulti={true}
                                value = {selectedUsers}
                                options={this.state.users}
                                placeholder={'add new users'}
                                onChange={this.handleChange}
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
                        )
                        :
                        <Spinner />
                    }
                    
                </div>
            </section>
        );
    }
}

export default NewProduct;
