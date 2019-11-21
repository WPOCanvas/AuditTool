import React, { Component } from 'react';
import { Accordion } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import QuestionArea from './QuestionArea';
import { API } from 'aws-amplify';
import Spinner from '../utility/Spinner';

export default class itemmodel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: false,
      progress: [],
      questionCount: 0 ,
      stage: this.props.stage.replace('.', ' ').split(/ /g)[1],
      errors: {
        cognito: null,
        blankfield: false
      }
    };
  }

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false
      }
    });
  };

  questionCount = () => {
    return this.props.subAreas.reduce( (pVal , cVal) => {
      return pVal + cVal.questions.length;
    }, 0);
  }

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
          done:'false'
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
    const subAreas = this.props.subAreas;
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

  fetchItems = async () => {
    this.setState({ loading: true });
    try {
      let items = await API.get(
        'ItemApi',
        '/items/Item-' +
          this.props.productName +
          '-' +
          this.props.auditDate +
          '-' +
          this.state.stage +
          '-' +
          this.props.user.attributes['custom:organization'] +
          '/Audit-'
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

  fetchProgress = async () => {
    this.setState({ loading: true });
    try {
      let items = await API.get(
        'ProgressApi',
        '/progress/Progress-' +
          this.props.productName +
          '-' +
          this.props.auditDate +
          '-' +
          this.props.user.attributes['custom:organization'] +
          '/' + this.state.stage
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
    
    let items = await this.fetchItems();
    if (items.length === 0) {
      await this.createItems();
      await this.createProgress();
      const itemsNew = await this.fetchItems();
      const progress = await this.fetchProgress();
      this.setState({ items: itemsNew, loading: false , progress });
    } else {
      let stateProgress = this.props.progressAll.filter( prog => { return prog['section'] === this.state.stage})
      this.setState({ items, loading: false, questionCount: items.length , progress : stateProgress });
    }
  }

  render() {
    return !this.state.loading ? (
      this.props.subAreas.map((subArea, i) => {
        return (
          <Accordion key={i} defaultActiveKey='1'>
            <Accordion defaultActiveKey='1'>
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant='link' eventKey='0'>
                    {this.props.stage.split('.')[0]}.{i} - {subArea.subName}
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey='0'>
                  <div>
                    <Card key={i} border='info'>
                      <Card.Body>{subArea.description}</Card.Body>
                    </Card>
                    <QuestionArea
                      questions={subArea.questions}
                      id={subArea.id}
                      qid={i}
                      items={[...this.state.items]}
                      progress={[...this.state.progress]}
                      productName={this.props.productName}
                      {...this.props}
                    />
                  </div>
                </Accordion.Collapse>
              </Card>
            </Accordion>
            <br />
          </Accordion>
        );
      })
    ) : (
      <Spinner />
    );
  }
}
