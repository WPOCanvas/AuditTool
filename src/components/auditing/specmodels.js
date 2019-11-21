import React, { Component } from 'react';
import { Accordion } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import Itemmodel from './itemmodel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class specmodels extends Component {
  state = {
    drop: false,
    done: false,
  };

  dropAcordination = () => {
    this.setState({ drop: true });
  };

  setProgress() {
    let selectedProgress = this.props.progressAll.filter( prog => {
      let x = this.props.area.name.split(' ')[0];
      return prog.section === x.replace(/[0-9]./g , "");
    });
    selectedProgress.length && this.setState({done: selectedProgress[0].done === 'true'})
  }

  componentDidMount() {
    this.setProgress();
  }

  render() {
    return (
      <Accordion>
        <Card>
          <Card.Header>
            <Accordion.Toggle
              as={Button}
              onClick={this.dropAcordination}
              variant='link'
              eventKey='0'
            >
              {this.props.area.name}
            </Accordion.Toggle>
            <div className='score'>
              {this.state.done? (
                <FontAwesomeIcon icon="check" color="green" />
              )
            : null}
            </div>
          </Card.Header>
          <Accordion.Collapse eventKey='0'>
            <div>
              {this.state.drop ? (
                <Card.Body>
                  <Itemmodel
                    subAreas={this.props.area.subAreas}
                    stage={this.props.area.name}
                    productName={this.props.productName}
                    {...this.props}
                  />
                </Card.Body>
              ) : null}
            </div>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }
}

export default specmodels;
