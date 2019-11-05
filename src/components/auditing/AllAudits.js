import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { API } from "aws-amplify";
import { MinMinSpinner , MinSpinner} from '../utility/Spinner';
import Select from 'react-select';
import FormErrors from '../FormErrors';

class UserAudit extends Component {
    state = {
        audits: [],
        loading: false,
        selectedProduct: null,
        productList: [],
        errors: {
            cognito: null,
            blankfield: false,
            validate: null
        }
    };

    clearErrorState = () => {
        this.setState({
            errors: {
                cognito: null,
                blankfield: false,
                validate: null
            }
        });
    };

    handleChange = selectedProduct => {
        this.setState({ selectedProduct });
    };

    createAudit = async event => {
        event.preventDefault();
        this.setState({ loading: true });
        this.clearErrorState();
        if (!this.state.selectedProduct) {
            this.setState({
                loading: false,
                errors: {
                    ...this.state.errors,
                    validate: 'Select a product'
                }
            });
            return;
        }
        let date = new Date().toGMTString().split(' ').join('-');
        let sk = "Product-" + this.state.selectedProduct.value + '-' + Date.now().toString();
        try {
            await API.post("AuditApi", "/audits", {
                body: {
                    pk: "Audit-Org-" + this.props.user.attributes['custom:organization'],
                    sk: sk,
                    name: "Audit-At-" + date,
                    product: this.state.selectedProduct.value,
                    createdAt: new Date().toDateString(),
                    createdBy: this.props.user.attributes.email,
                    score: null
                }
            });
            this.props.history.push({
                pathname: `/auditQues/${sk}`,
                state: {
                    productName: this.state.selectedProduct.value,
                    auditDate: date
                }
            });
        } catch (error) {
            let err = null;
            !error.message ? err = { "message": error } : err = error;
            this.setState({
                loading: false,
                errors: {
                    ...this.state.errors,
                    cognito: err
                }
            });
        }
        this.setState({ loading: false });
    };

    fetchAudits = async () => {
        this.setState({ loading: true })
        try {
            let audits = await API.get("AuditApi", '/audits/Audit-Org-' + this.props.user.attributes['custom:organization'] + '/Product-');
            this.setState({ audits })
        } catch (error) {
            let err = null;
            !error.message ? err = { "message": error } : err = error;
            this.setState({
                loading: false,
                errors: {
                    ...this.state.errors,
                    cognito: err
                }
            });
        }
        this.setState({ loading: false })
    }

    async fetchProductList() {
        this.setState({ loading: true });
        const orgData = 'Org-' + this.props.user.attributes['custom:organization'];
        try {
            const response = await API.get("ProductApi", "/products/Product/" + orgData);
            const options = response.map(item => {
                return {
                    value: item.name,
                    label: item.name
                }
            });
            this.setState({ productList: options });
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
        this.setState({ loading: false });
    }

    componentDidMount() {
        this.fetchProductList();
        this.fetchAudits();
    }
    render() {
        const { selectedProduct, productList } = this.state;
        return (
            <section>
                <h3 style={{ textAlign: "center" }}>Recent Audits</h3>
                <div className="columns features">
                    {!this.state.loading ? (this.state.audits && this.state.audits.map((audit, i) => {
                        return (
                            <div key={i} className="column is-3">
                                <div className="card is-shady">
                                    <div className="card-content">
                                        <div className="content">
                                            <h5>{audit.name}</h5>
                                            <p>{audit.createdAt}</p>
                                            <p>{audit.createdBy}</p>
                                            <p><Link to={{ pathname: `/auditQues/${audit.sk}`, state: { productName: audit.product, auditDate: audit.name.split('-').splice(2).join('-') } }}>See more</Link></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })) : <MinSpinner />}
                    <div className="column is-3">
                        <div className="card is-shady">
                            <div className="card-content">
                                <div className="content">
                                    <h4 style={{ textAlign: "center" }}>Create New</h4>
                                    <FormErrors formerrors={this.state.errors} />
                                    {
                                        !this.state.loading ? (
                                            <form onSubmit={this.createAudit}>
                                                <div className="field">
                                                    <Select
                                                        isMulti={false}
                                                        value={selectedProduct}
                                                        options={productList}
                                                        placeholder={'select a product'}
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                                <div className="field">
                                                    <p className="control">
                                                        <button className="button is-success">
                                                            New Audit
                                                </button>
                                                    </p>
                                                </div>
                                            </form>
                                        )
                                            :
                                            <MinMinSpinner />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default UserAudit;

