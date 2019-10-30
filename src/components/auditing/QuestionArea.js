import React, { Component } from "react";
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { API } from "aws-amplify";

export default class QuestionArea extends Component {
  state = {
    items: [],
    stage: this.props.stage.replace('.', ' ').split(/ /g)[1],
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

  switch = {
    'Low' : 2,
    'Medium': 5,
    'High': 10
  }
  
  switchReverse = {
     2 : 'Low' ,
     5 : 'Medium',
     10: 'High'
  }

  switchFill = {
    10 : 'success',
    5: 'warning',
    2: 'danger'
  }

  switchOutline = {
    'Low' : 'outline-danger',
    'Medium': 'outline-warning',
    'High': 'outline-success'
  }

  updateButtons = (i , name ) => {
    let item = this.props.items.filter(item => item.id === this.props.id && item.qid == i);
    if (item.length !== 0 ) {
      if (item[0].score == 0) {
        return this.switchOutline[name]
      } else {
        let nameToMatch = this.switchReverse[item[0].score]
        if( nameToMatch === name ) {
          return this.switchFill[item[0].score]
        }
        return this.switchOutline[name]
      }
    }
    return 'outline-success'
  }

  updateItem = async event => {
    this.updateButtons();
    let updateItem = this.props.items.find(item => item.id === this.props.id && item.qid == event.target.value);
    updateItem.score = this.switch[event.target.name];
    try {
      await API.put("ItemApi", "/items", {
        body: updateItem
      });
    } catch (error) {
      let err = null;
      !error.message ? err = { "message": error } : err = error;
      this.setState({
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });
    }
  };
  render() {
    return this.props.questions.map((question, i) => {
      return <Card key={i} border="info">
        <Card.Body>
          <Card.Text>
            {question}
          </Card.Text>
          <Button onClick={this.updateItem} value={i} name="High" variant={this.updateButtons(i , 'High')} size="sm">High</Button>
          <Button onClick={this.updateItem} value={i} name="Medium" variant={this.updateButtons(i , 'Medium')} size="sm">Medium</Button>
          <Button onClick={this.updateItem}  value={i} name="Low"variant={this.updateButtons(i , 'Low')} size="sm">Low</Button>
        </Card.Body>
        <Card.Footer></Card.Footer>
      </Card>
    });
  }
}
