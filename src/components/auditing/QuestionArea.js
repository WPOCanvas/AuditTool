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

  updateItem = async event => {
    let updateItem = this.props.items.find(item => item.id === this.props.id && item.qid == event.target.value);
    updateItem.score = event.target.name;
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
          <Button onClick={this.updateItem} value={i} name="High" variant="outline-success" size="sm">High</Button>
          <Button onClick={this.updateItem} value={i} name="Medium" variant="outline-warning" size="sm">Medium</Button>
          <Button onClick={this.updateItem}  value={i} name="Low" variant="outline-danger" size="sm">Low</Button>
        </Card.Body>
        <Card.Footer></Card.Footer>
      </Card>
    });
  }
}
