import React, { Component } from 'react';
import { API } from "aws-amplify";
import UserAudit from '../../UserAudit'


class NewProduct extends Component {
    state = {
        productId: null,
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

    async fetchAuditList() {
        const orgData = 'Org_' + this.props.user.attributes['custom:organization'];
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
    }


    async componentDidMount() {
        await this.fetchAuditList();
    }

    render() {
        return (
            <section className="section auth">
                <div className="container">
                    <UserAudit />
                </div>
            </section>
        );
    }
}

export default NewProduct;
