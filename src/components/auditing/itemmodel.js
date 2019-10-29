import React, { Component } from "react";
import { Accordion } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import QuestionArea from "./QuestionArea";
import { API } from "aws-amplify";

export default class itemmodel extends Component {
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

  createItems = async () => {
    const subAreas = this.props.subAreas;
    try {
      subAreas.map(async subArea => {
        await Promise.all(subArea.questions.map(async( _question , i) => {
          let sk = "Audit-" + subArea.id + '-' + i + '-' + Date.now().toString();
          await API.post("ItemApi", "/items", {
            body: {
              pk: "Item-" + this.props.productName + '-' + this.state.stage + '-' + this.props.user.attributes['custom:organization'],
              sk: sk,
              score: 0,
              id: subArea.id,
              qid: i
            }
          });
        }))
      })
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

  fetchItems = async () => {
    try {
      let items = await API.get("ItemApi", '/items/Item-' + this.props.productName + '-' + this.state.stage + '-' + this.props.user.attributes['custom:organization'] + '/Audit-');
      return items;
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
  }

  async componentDidMount() {
    let items = await this.fetchItems();
    if (items.length === 0) {
      await this.createItems()
      const itemsNew = this.fetchItems();
      this.setState({ items: itemsNew })
    } else {
      this.setState({ items })
    }
  }
  render() {
    return this.props.subAreas.map((subArea, i) => {
      return (
        <Accordion key={i} defaultActiveKey="1">
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                {subArea.subName} introduction
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>{subArea.description}</Card.Body>
            </Accordion.Collapse>
          </Card>
          <Accordion defaultActiveKey="1">
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                  Evaluate
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <QuestionArea questions={subArea.questions} id={subArea.id} qid={i} items={this.state.items} productName={this.props.productName} {...this.props} />
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <br />
        </Accordion>
      );
    });
  }
}
