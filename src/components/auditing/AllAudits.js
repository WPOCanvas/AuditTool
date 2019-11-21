import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { API } from 'aws-amplify';
import Spinner from '../utility/Spinner';
import { Card } from 'react-bootstrap';
import { CardGroup } from 'react-bootstrap';
import {  MdSubject,MdToday, MdEmail,MdAddCircle} from "react-icons/md";
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
                      minWidth: '270px',
                      minHeight: '250px',
                      backgroundColor:'#e0f7fa'
                    }}
                  >
                    <Card.Body>
                      <Card.Title>
                        {this.state.audits.length
                          ? null
                          : (<span className="f-size">You haven&apos;t performed any audits yet</span>)}
                      </Card.Title>
                      <form className='align-center'>
                        <Link
                          to={'/PerformAudit'}
                          className='button'
                        >
                          <MdAddCircle/>
                          Perform Audit
                        </Link>
                      </form>
                    </Card.Body>
                  </Card>
                </div>
                {this.state.audits &&
                  this.state.audits.map((audit, i) => {
                    let wholedesc =audit.description;
                    let shortendesc= wholedesc.substr(0,50)+ ' ...';
                    return (
                      <div key={i} className='col-sm-3'>
                        <Card
                          style={{
                            padding: '5px',
                            margin: '5px',
                            minWidth: '270px',
                            minHeight: '250px',
                            backgroundColor:'#e0f2f1'
                          }}
                        >
                          <Card.Body>
                            <Card.Title style={{color:'#14cba8'}}>{audit.name}</Card.Title>
                            <br />
                            <Card.Text>
                            <MdSubject/>
                              {shortendesc}
                              <br />
                              <MdToday/>
                              {audit.createdAt}
                              <br />
                              <MdEmail/>
                              {audit.createdBy}
                              <br />
                              <Link
                                to={{
                                  pathname: `/auditQues/${audit.sk}`,
                                  state: {
                                    productName: audit.product,
                                    auditDate: audit.auditDate,
                                    auditDesc: audit.description
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
