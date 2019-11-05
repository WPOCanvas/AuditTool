import React, { Component } from "react";
import { Card } from "react-bootstrap";
import { MinMinSpinner } from "../utility/Spinner";
import Question from "./Question";

export default class QuestionArea extends Component {
  state = {
    items: [],
    loading: false,
    stage: this.props.stage.replace('.', ' ').split(/ /g)[1],
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
    'Low': 2,
    'Medium': 5,
    'High': 10
  }

  switchReverse = {
    2: 'Low',
    5: 'Medium',
    10: 'High'
  }

  switchFill = {
    10: 'success',
    5: 'warning',
    2: 'danger'
  }

  switchOutline = {
    'Low': 'outline-danger',
    'Medium': 'outline-warning',
    'High': 'outline-success'
  }

  updateButtons = (i, name) => {
    let item = []
    if (this.props.items) {
      item = this.props.items.filter(item => item.id === this.props.id && Number(item.qid) === i);
    }
    if (item.length !== 0) {
      if (Number(item[0].score) === 0) {
        return this.switchOutline[name]
      } else {
        let nameToMatch = this.switchReverse[item[0].score]
        if (nameToMatch === name) {
          return this.switchFill[item[0].score]
        }
        return this.switchOutline[name]
      }
    }
    return 'outline-success'
  }

  render() {
    return this.props.questions.map((question, i) => {
      return <Card key={i} border="info">
          <Card.Body>
            <Card.Text>
              {question}
            </Card.Text>
              <Question updateButtons={this.updateButtons} {...this.props} i={i} />
          </Card.Body>
      </Card>
    });
  }
}
