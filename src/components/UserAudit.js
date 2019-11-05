import React, { Component } from "react";
import { Link } from "react-router-dom";
import { API } from "aws-amplify";
import { MinSpinner } from "./utility/Spinner";
import { Card } from "react-bootstrap";
import { CardGroup } from "react-bootstrap";

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
    this.setState({ loading: true });
    let date = new Date()
      .toGMTString()
      .split(" ")
      .join("-");
    let sk =
      "Product-" +
      this.props.location.state.productName +
      "-" +
      Date.now().toString();
    try {
      await API.post("AuditApi", "/audits", {
        body: {
          pk: "Audit-Org-" + this.props.user.attributes["custom:organization"],
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
      !error.message ? (err = { message: error }) : (err = error);
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
    this.setState({ loading: true });
    try {
      let audits = await API.get(
        "AuditApi",
        "/audits/Audit-Org-" +
          this.props.user.attributes["custom:organization"] +
          "/Product-" +
          this.props.location.state.productName
      );
      this.setState({ audits });
    } catch (error) {
      let err = null;
      !error.message ? (err = { message: error }) : (err = error);
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
  componentDidMount() {
    this.fetchAudits();
  }
  render() {
    return (
      <section>
        <h3 style={{ textAlign: "center" }}>Recent Audits</h3>
        <CardGroup>
          <div className="row">
            {!this.state.loading ? (
              this.state.audits &&
              this.state.audits.map((audit, i) => {
                return (
                  <div key={i} className="col-sm-3">
                    <Card style={{padding:'5px', margin:'5px'}}>
                      <Card.Body>
                        <Card.Title>{audit.name}</Card.Title>
                        <Card.Text>
                          <br/>
                        {this.props.location.state.productName}
                        <br/>
                        {audit.createdAt}
                        <br/>
                        {audit.createdBy}
                        <br/>
                        <Link to={{ pathname: `/auditQues/${audit.sk}`, state: { productName: this.props.location.state.productName, auditDate: audit.name.split('-').splice(2).join('-') } }}>See more</Link>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                );
              })
            ) : (
              <MinSpinner />
            )}
            <div className="col-sm-3">
                    <Card style={{padding:'5px', margin:'5px',minHeight:'250px' , minWidth: '250px'}}>
                      
                      <Card.Body>
                        <Card.Title>Create New Audit</Card.Title>
                        <Card.Text onClick={this.createAudit} style={{ textAlign: "center" }}>
                        
                       +
                       
  
                        </Card.Text>
                      </Card.Body>
                      
                    </Card>
                  </div>
           
          </div>
        </CardGroup>
      </section>
    );
  }
}

export default UserAudit;
