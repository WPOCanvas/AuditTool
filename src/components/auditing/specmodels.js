import React, { Component } from "react";
import { Accordion } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Itemmodel from './itemmodel';

class specmodels extends Component {
  state = {
    score: 0,
    questionCount: 0,
  };
  setQuestionValues = (val) => {
    this.setState( () => {
      return val
    })
  }

  render() {
    return (
        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                {this.props.area.name}
              </Accordion.Toggle>
              <div className="score">{this.state.score+ "/" + this.state.questionCount}</div>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Itemmodel setQuestionValues={this.setQuestionValues} subAreas={this.props.area.subAreas} stage={this.props.area.name} productName={this.props.productName} {...this.props}  />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
    );
  }
}

export default specmodels;
