import React, { Component } from "react";
import { Accordion } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Itemmodel from './itemmodel';

class specmodels extends Component {
  render() {
      const { area } = this.props.area;
    return (
        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                {this.props.area.name}
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Itemmodel subAreas={this.props.area.subAreas}/>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
    );
  }
}

export default specmodels;
