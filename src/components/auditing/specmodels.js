import React, { Component } from "react";
import { Accordion } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Itemmodel from './itemmodel';
import { ProgressBar } from "react-bootstrap";
import { API } from "aws-amplify";

class specmodels extends Component {
  constructor(){
    super()
    this.state={
      items: []
    }
  }


  async componentDidMount(){
    console.log(this.props)
    let items = await API.get("ItemApi", '/items/Item-' + this.props.productName + '-' + this.props.auditDate + '-' + this.state.stage + '-' + this.props.user.attributes['custom:organization'] + '/Audit-');
    console.log(items)
    this.setState({
      items:items
    })

  }
  render() {
    
    let zeroItems=this.state.items.filter(item=>item.score!=0);
    let valuepercentage= ((zeroItems.length)/9)*100

    return (
        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                {this.props.area.name}
                <ProgressBar now={valuepercentage} label={`${valuepercentage.toFixed(2)}%`} />
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Itemmodel subAreas={this.props.area.subAreas} stage={this.props.area.name} productName={this.props.productName} {...this.props} />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
    );
  }
}

export default specmodels;
