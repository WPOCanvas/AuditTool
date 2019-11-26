import React, { Component } from 'react';
import { Accordion } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import Itemmodel from './itemmodel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API } from 'aws-amplify';
import Spinner from '../utility/Spinner';
class specmodels extends Component {
  state = {
    drop: false,
    done: false,
    stage: this.props.area.name.replace('.', ' ').split(/ /g)[1],
    createdProgress: false,
    loading: false
  };

  dropAcordination = () => {
    this.setState({ drop: true });
  };

  setProgress() {
    let selectedProgress = this.props.progressAll.filter(prog => {
      let x = this.props.area.name.split(' ')[0];
      return prog.section === x.replace(/[0-9]./g, '');
    });
    selectedProgress.length &&
      this.setState({ done: selectedProgress[0].done === 'true' });
  }

  questionCount = () => {
    return this.props.area.subAreas.reduce((pVal, cVal) => {
      return pVal + cVal.questions.length;
    }, 0);
  };

  createProgress = async () => {
    this.setState({ loading: true });
    try {
      let sk = this.state.stage + '-' + Date.now().toString();
      await API.post('ProgressApi', '/progress', {
        body: {
          pk:
            'Progress-' +
            this.props.productName +
            '-' +
            this.props.auditDate +
            '-' +
            this.props.user.attributes['custom:organization'],
          sk: sk,
          score: 0,
          section: this.state.stage,
          questionCount: 0,
          fullQuestions: this.questionCount(),
          High: 0,
          Low: 0,
          Medium: 0,
          done: 'false'
        }
      });
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

  createItems = async () => {
    this.setState({ loading: true });
    const subAreas = this.props.area.subAreas;
    try {
      const promise = subAreas.map(async subArea => {
        const promiseDeep = subArea.questions.map(async (_question, i) => {
          let sk =
            'Audit-' + subArea.id + '-' + i + '-' + Date.now().toString();
          let addedItem = await API.post('ItemApi', '/items', {
            body: {
              pk:
                'Item-' +
                this.props.productName +
                '-' +
                this.props.auditDate +
                '-' +
                this.state.stage +
                '-' +
                this.props.user.attributes['custom:organization'],
              sk: sk,
              score: 0,
              id: subArea.id,
              qid: i
            }
          });
          return addedItem;
        });
        return await Promise.all(promiseDeep);
      });
      return await Promise.all(promise);
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
    if (this.props.progressAll.length === 0) {
      await this.createItems();
      await this.createProgress();
      this.setState({createdProgress: true})
    }
    this.setProgress();
    this.setState({ loading: false });
  }

  render() {
    return (
      <Accordion>
        {!this.state.loading ? (
          <Card>
            <Card.Header>
              <Accordion.Toggle
                as={Button}
                onClick={this.dropAcordination}
                variant='link'
                eventKey='0'
              >
                <FontAwesomeIcon icon='caret-down' color='#007bff' />
                {'   '}
                {this.props.area.name}
              </Accordion.Toggle>
              <div className='score'>
                {this.state.done ? (
                  <FontAwesomeIcon icon='check' color='green' />
                ) : null}
              </div>
            </Card.Header>
            <Accordion.Collapse eventKey='0'>
              <div>
                {this.state.drop ? (
                  <Card.Body>
                    <Itemmodel
                      subAreas={this.props.area.subAreas}
                      stage={this.props.area.name}
                      productName={this.props.productName}
                      createdProgress={this.state.createdProgress}
                      {...this.props}
                    />
                  </Card.Body>
                ) : null}
              </div>
            </Accordion.Collapse>
          </Card>
        ) : (
          <Spinner />
        )}
      </Accordion>
    );
  }
}

export default specmodels;
