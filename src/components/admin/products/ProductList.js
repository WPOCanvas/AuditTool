import React, { Component } from 'react';
import { API } from "aws-amplify";
import { Link } from 'react-router-dom'


class NewProduct extends Component {
    state = {
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

    async fetchProductList() {
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
        await this.fetchProductList();
    }

    render() {
        return (
            <section className="section auth">
                <div className="container">
                    <h1>Product</h1>

                    <div class="list is-hoverable">
                        {this.state.productList && this.state.productList.map((product, i) => {
                            return (
                                <Link key={i} to={`/product/${product.sk}`} className="list-item">
                                    {product.name}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>
        );
    }
}

export default NewProduct;
