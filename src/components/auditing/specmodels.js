import React, { Component } from "react";
import { Accordion } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Itemmodel from './itemmodel';
import SProgressBar from './sProgressBar'

class specmodels extends Component {

  render() {
    return (
        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                {this.props.area.name}
                <SProgressBar subAreas={this.props.area.subAreas} stage={this.props.area.name} productName={this.props.productName} {...this.props}  />
              
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Itemmodel subAreas={this.props.area.subAreas} stage={this.props.area.name} productName={this.props.productName} {...this.props}  />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
    );
  }
}

export default specmodels;
