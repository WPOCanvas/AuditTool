import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import Question from './question';
import { API } from "aws-amplify";
import { progressBarService } from "../../../../services/ProgressBar.service";

export default class Questions extends Component {
  state = {
    items: [],
    spinnerOn: {
      spin: false,
      key: []
    },
    stage: this.props.stage.replace('.', ' ').split(/ /gi)[0],
    errors: {
      cognito: null,
      blankfield: false
    }
  };

  clearErrorState = () => {
    this.setState({
      loading: false,
      errors: {
        cognito: null,
        blankfield: false
      }
    });
  };

  switch = {
    Low: 1,
    Medium: 2,
    High: 3
  };

  switchReverse = {
    1: 'Low',
    2: 'Medium',
    3: 'High'
  };

  switchFill = {
    3: 'success',
    2: 'warning',
    1: 'danger'
  };

  switchOutline = {
    Low: 'outline-danger',
    Medium: 'outline-warning',
    High: 'outline-success'
  };

  sendStatus() {
    progressBarService.sendStatus(1);
  }

  updateButtons = (i, name) => {
    let item = [];
    if (this.props.items) {
      item = this.props.items.filter(
        item => item.id === this.props.id && Number(item.qid) === i
      );
    }
    if (item.length !== 0) {
      if (Number(item[0].score) === 0) {
        return this.switchOutline[name];
      } else {
        let nameToMatch = this.switchReverse[item[0].score];
        if (nameToMatch === name) {
          return this.switchFill[item[0].score];
        }
        return this.switchOutline[name];
      }
    }
    return 'outline-success';
  };

  updateItem = async (event) => {
    event.persist()
    this.setState({  spinnerOn: { spin: true , key: [...this.state.spinnerOn.key , Number(event.target.value)] } });
    let updateItem = this.props.items.find(
      item =>
        item.id === this.props.id && item.qid === Number(event.target.value)
    );
    let updateProgress = this.props.progress[0];
    if (Number(updateItem.score) === 0) {
      this.sendStatus();
      ++updateProgress[event.target.name];
      ++updateProgress.questionCount;
    } else {
      --updateProgress[this.switchReverse[updateItem.score]];
      ++updateProgress[event.target.name];
    }
    if (updateProgress.questionCount === this.props.items.length) {
      updateProgress.done = "true";
    }
    updateProgress.score =
      updateProgress.score +
      Number(this.switch[event.target.name]) -
      updateItem.score;
    updateItem.score = this.switch[event.target.name];
    try {
      await API.put("ItemApi", "/items", {
        body: updateItem
      });
      await API.put("ProgressApi", "/progress", {
        body: updateProgress
      });
    } catch (error) {
      let err = null;
      !error.message ? (err = { message: error }) : (err = error);
      this.setState({
        spinnerOn: { spin: false , key: null},
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });
    }
    this.setState({ spinnerOn: { spin: false , key: this.state.spinnerOn.key.length ? this.state.spinnerOn.key.filter(val => val !== Number(event.target.value )) : null } });
  };

  render() {
    return this.props.questions.map((question, i) => {
      return (
        <Card key={i} border='info'>
          <Card.Body>
            <Card.Text>{question}</Card.Text>
            <Question
              updateButtons={this.updateButtons}
              updateItem={this.updateItem}
              spinner={this.state.spinnerOn}
              {...this.props}
              i={i}
            />
          </Card.Body>
        </Card>
      );
    });
  }
}
