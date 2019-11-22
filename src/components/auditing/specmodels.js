import React, { Component } from 'react';
import { Accordion } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import Itemmodel from './itemmodel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API } from 'aws-amplify';
class specmodels extends Component {
  state = {
    drop: false,
    done: false,
    stage: this.props.area.name.replace('.', ' ').split(/ /g)[1]
  };

  dropAcordination = () => {
    this.setState({ drop: true });
  };

  setProgress() {
    let selectedProgress = this.props.progressAll.filter( prog => {
      let x = this.props.area.name.split(' ')[0];
      return prog.section === x.replace(/[0-9]./g , "");
    });
    selectedProgress.length && this.setState({done: selectedProgress[0].done === 'true'})
  }

  createProgress = async () => {
    this.setState({ loading: true });
    console.log('here')
    try {
      let sk = this.state.stage + '-' + Date.now().toString();
      let c = await API.post('ProgressApi', '/progress', {
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
          done:'false'
        }
      });
      console.log(c)
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
    console.log( this.props.progressAll.length)
    if ( this.props.progressAll.length === 0) {
      await this.createItems();
      await this.createProgress();
    }
    this.setProgress();
  }

  render() {
    return (
      <Accordion>
        <Card>
          <Card.Header>
            <Accordion.Toggle
              as={Button}
              onClick={this.dropAcordination}
              variant='link'
              eventKey='0'
            >
              {this.props.area.name}
            </Accordion.Toggle>
            <div className='score'>
              {this.state.done? (
                <FontAwesomeIcon icon="check" color="green" />
              )
            : null}
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
                    {...this.props}
                  />
                </Card.Body>
              ) : null}
            </div>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }
}

export default specmodels;
