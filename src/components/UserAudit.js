import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { API } from "aws-amplify";
import { MinSpinner} from './utility/Spinner';

class UserAudit extends Component {
    state = {
        audits: [],
        loading: false,

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

    createAudit = async () => {
        this.setState({ loading: true })
        let date = new Date().toGMTString().split(' ').join('-');
        let sk = "Product-" + this.props.location.state.productName + '-' + Date.now().toString();
        try {
            await API.post("AuditApi", "/audits", {
                body: {
                    pk: "Audit-Org-" + this.props.user.attributes['custom:organization'],
                    sk: sk,
                    name: "Audit-At-" + date,
                    createdAt: new Date().toDateString(),
                    createdBy: this.props.user.attributes.email,
                    score: null
                }
            });
            this.props.history.push({
                pathname: `/auditQues/${sk}`,
                state: {
                    productName: this.props.location.state.productName,
                    auditDate: date
                }
            });
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
        this.setState({ loading: false })
    };

    fetchAudits = async () => {
        this.setState({ loading: true })
        try {
            let audits = await API.get("AuditApi", '/audits/Audit-Org-' + this.props.user.attributes['custom:organization'] + '/Product-' + this.props.location.state.productName);
            this.setState({ audits })
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
        this.setState({ loading: false })
    }
    componentDidMount() {
        this.fetchAudits();
    }
    render() {
        return (
            <section>
                <h3 style={{ textAlign: "center" }}>Recent Audits</h3>
                <div className="columns features">
                    {!this.state.loading ? ( this.state.audits && this.state.audits.map((audit, i) => {
                        return (
                            <div key={i} className="column is-3">
                                <div className="card is-shady">
                                    <div className="card-content">
                                        <div className="content">
                                            <h5>{audit.name}</h5>
                                            <p>{this.props.location.state.productName}</p>
                                            <p>{audit.createdAt}</p>
                                            <p>{audit.createdBy}</p>
                                            <p><Link to={{ pathname: `/auditQues/${audit.sk}`, state: { productName: this.props.location.state.productName, auditDate: audit.name.split('-').splice(2).join('-') } }}>See more</Link></p>
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
                                    <div onClick={this.createAudit}><h1 style={{ textAlign: "center" }}>+</h1></div>
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

