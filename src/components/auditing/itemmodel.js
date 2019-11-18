import React, { Component } from "react";
import { Accordion } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import QuestionArea from "./QuestionArea";
import { API } from "aws-amplify";
import Spinner from "../utility/Spinner";

export default class itemmodel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      loading: false,
      stage: this.props.stage.replace('.', ' ').split(/ /g)[1],
      errors: {
        cognito: null,
        blankfield: false
      }
    }
  }

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false
      }
    });
  };

  createItems = async () => {
    this.setState({ loading: true })
    const subAreas = this.props.subAreas;
    try {
      const promise = subAreas.map(async subArea => {
        const promiseDeep = subArea.questions.map(async (_question, i) => {
          let sk = "Audit-" + subArea.id + '-' + i + '-' + Date.now().toString();
          let addedItem = await API.post("ItemApi", "/items", {
            body: {
              pk: "Item-" + this.props.productName + '-' + this.props.auditDate + '-' + this.state.stage + '-' + this.props.user.attributes['custom:organization'],
              sk: sk,
              score: 0,
              id: subArea.id,
              qid: i
            }
          });
          return addedItem;
        })
        return await Promise.all(promiseDeep);
      })
      return await Promise.all(promise);
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
    this.setState({ loading: true });
    try {
      let items = await API.get("ItemApi", '/items/Item-' + this.props.productName + '-' + this.props.auditDate + '-' + this.state.stage + '-' + this.props.user.attributes['custom:organization'] + '/Audit-');
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
      await this.createItems();
      const itemsNew = await this.fetchItems();
      this.setState({ items: itemsNew, loading: false })
    } else {
      this.setState({ items, loading: false })
    }
  }

  render() {
    return (
      !this.state.loading ? (
        this.props.subAreas.map((subArea, i) => {
          return (
            <Accordion key={i} defaultActiveKey="1">
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="0">
                    {subArea.subName} introduction
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>{subArea.description}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
              <Accordion defaultActiveKey="1">
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                      Evaluate {subArea.subName}
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
        })
      )
        : <Spinner />
    )
  }
}
