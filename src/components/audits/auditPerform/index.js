import React, { Component } from 'react';
import AuditLayout from './AuditLayout';
import AuditData from '../auditData/auditTemplateData.json';
import { Button } from 'react-bootstrap';
import { API } from 'aws-amplify';
import { progressBarService } from '../../../services/ProgressBar.service';
import Spinner from '../../utility/Spinner';
import { Card } from 'react-bootstrap';
import AuditProgress from '../auditProgress';

class AuditPerform extends Component {
  modelData = AuditData;
  state = {
    id: this.props.location.pathname.split('/')[2],
    loading: true,
    progress: []
  };

  OverRoll = () => {
    this.props.history.push({
      pathname: `/result/${this.state.id}`,
      state: {
        productName: this.props.location.state.productName,
        auditDate: this.props.location.state.auditDate
      }
    });
  };

  sendItemCount() {
    let itemCount = this.modelData.areas.reduce((preVal, area) => {
      return (
        preVal +
        area.subAreas.reduce((pVal, cVal) => {
          return pVal + cVal.questions.length;
        }, 0)
      );
    }, 0);
    progressBarService.sendItemCount(itemCount);
  }

  sendStatus() {
    let count = this.state.progress.reduce((pVal, cVal) => {
      return pVal + cVal.questionCount;
    }, 0);
    progressBarService.sendStatus(count);
  }

  fetchProgress = async () => {
    this.setState(() => {
      return { loading: true };
    });
    try {
      let items = await API.get(
        'ProgressApi',
        '/progress/Progress-' +
          this.props.location.state.productName +
          '-' +
          this.props.location.state.auditDate +
          '-' +
          this.props.user.attributes['custom:organization']
      );
      return items;
    } catch (error) {
      let err = null;
      !error.message ? (err = { message: error }) : (err = error);
      this.setState({
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });
    }
  };

  async componentDidMount() {
    const progress = await this.fetchProgress();
    if (progress.length !== 0) {
      this.setState(() => {
        return { progress };
      });
    }
    this.sendItemCount();
    this.sendStatus();
    this.setState({ loading: false });
  }
  render() {
    return (
      <section className='container'>
        <div className='progressBar'>
          <AuditProgress />
        </div>
        <div>
          {!this.state.loading ? (
            <div>
              <Card style={{ margin: '60px' }}>
                <Card.Body style={{ textAlign: 'center' }}>
                  <h3>
                    New Audit For {this.props.location.state.productName}{' '}
                    Product {this.props.user.username} Company
                  </h3>
                  <hr />
                </Card.Body>
                <Card.Body
                  style={{ padding: '0 60px 30px 60px', textAlign: 'justify' }}
                >
                  <p style={{ color: '#14cba8' }}>Audit Description : </p>
                  {this.props.location.state.auditDesc}
                </Card.Body>
                <Card.Body
                  style={{
                    padding: '0 60px 30px 60px',
                    textAlign: 'justify',
                    fontSize: '12px'
                  }}
                >
                  <p style={{ color: '#9e9e9e' }}>
                    ** WPC canvas gives you 10 model phases for evaluate your
                    product, what you have to do is go through all the 10 models
                    and answer the given questions
                  </p>
                </Card.Body>
              </Card>
              <div>
                <Card>
                  <Card.Body>
                    {!this.state.loading &&
                      this.modelData.areas.map((area, i) => {
                        return (
                          <AuditLayout
                            key={i}
                            area={area}
                            auditDate={this.props.location.state.auditDate}
                            productName={this.props.location.state.productName}
                            progressAll={this.state.progress}
                            {...this.props}
                          />
                        );
                      })}
                  </Card.Body>
                </Card>
              </div>
              <div className='align-center p-20'>
                <Button onClick={this.OverRoll} variant='light'>
                  Check Result
                </Button>
              </div>
            </div>
          ) : (
            <Spinner />
          )}
        </div>
      </section>
    );
  }
}
export default AuditPerform;
