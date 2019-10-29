import React, { Component } from "react";
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";

export default class QuestionArea extends Component {
  render() {
  
   return this.props.questions.map((question , i) => {
    //   {console.log(question)}
     return <Card key={i} border="info">
          <Card.Body>
              <Card.Text>
              {question}
              </Card.Text>
              <Button variant="outline-success" size="sm">High</Button>
              <Button variant="outline-warning" size="sm">Medium</Button>
              <Button variant="outline-danger" size="sm">Low</Button>
          </Card.Body>
          <Card.Footer></Card.Footer>
      </Card>
    });
  }
}
