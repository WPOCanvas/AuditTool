import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { API } from 'aws-amplify';
import Spinner from '../utility/Spinner';
import { Card } from 'react-bootstrap';
import { CardGroup } from 'react-bootstrap';

class UserAudit extends Component {
  state = {
    audits: [],
    loading: false,
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

  fetchAudits = async () => {
    this.setState({ loading: true });
    try {
      let audits = await API.get(
        'AuditApi',
        '/audits/Audit-Org-' +
          this.props.user.attributes['custom:organization'] +
          '/Product-'
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

  async componentDidMount() {
    await this.fetchAudits();
  }
  render() {
    return !this.state.loading ? (
      <section className='section'>
        <div className='container'>
          <section>
            <h3 style={{ textAlign: 'center' }}>Audits</h3>
            <CardGroup>
              <div className='row'>
                <div className='col-sm-3'>
                  <Card
                    style={{
                      padding: '5px',
                      margin: '5px',
                      minWidth: '250px',
                      minHeight: '250px'
                    }}
                  >
                    <Card.Body>
                      <Card.Title>
                        {this.state.audits.length
                          ? null
                          : "You haven't performed any audits yet"}
                      </Card.Title>
                      <form className='align-center'>
                        <Link
                          to={'/PerformAudit'}
                          className='button'
                        >
                          Perform Audit
                        </Link>
                      </form>
                    </Card.Body>
                  </Card>
                </div>
                {this.state.audits &&
                  this.state.audits.map((audit, i) => {
                    return (
                      <div key={i} className='col-sm-3'>
                        <Card
                          style={{
                            padding: '5px',
                            margin: '5px',
                            minWidth: '250px',
                            minHeight: '250px'
                          }}
                        >
                          <Card.Body>
                            <Card.Title>{audit.name}</Card.Title>
                            <br />
                            <Card.Text>
                              {audit.description}
                              <br />
                              {audit.createdAt}
                              <br />
                              {audit.createdBy}
                              <br />
                              <Link
                                to={{
                                  pathname: `/auditQues/${audit.sk}`,
                                  state: {
                                    productName: audit.product,
                                    auditDate: audit.auditDate
                                  }
                                }}
                              >
                                See more
                              </Link>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </div>
                    );
                  })}
              </div>
            </CardGroup>
          </section>
        </div>
      </section>
    ) : (
      <Spinner />
    );
  }
}

export default UserAudit;
