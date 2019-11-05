import React, { Component } from 'react'
import { Button } from "react-bootstrap";
import { API } from "aws-amplify";
import { MinMinSpinner } from '../utility/Spinner';

export class Question extends Component {
    state = {
        items: [],
        loading: false,
        errors: {
            cognito: null,
            blankfield: false
        }
    };

    switch = {
        'Low': 2,
        'Medium': 5,
        'High': 10
      }

    updateItem = async event => {
        this.setState({ loading: true });
        let updateItem = this.props.items.find(item => item.id === this.props.id && item.qid === Number(event.target.value));
        updateItem.score = this.switch[event.target.name];
        try {
            await API.put("ItemApi", "/items", {
                body: updateItem
            });
        } catch (error) {
            let err = null;
            !error.message ? err = { "message": error } : err = error;
            this.setState({
                loading: false,
                errors: {
                    ...this.state.errors,
                    cognito: err
                }
            });
        }
        this.setState({ loading: false })
    };

    render() {
        return (
            <div>
                {!this.state.loading ? (
                    <div>
                        <Button onClick={this.updateItem} value={this.props.i} name="High" variant={this.props.updateButtons(this.props.i, 'High')} size="sm">High</Button>
                        <Button onClick={this.updateItem} value={this.props.i} name="Medium" variant={this.props.updateButtons(this.props.i, 'Medium')} size="sm">Medium</Button>
                        <Button onClick={this.updateItem} value={this.props.i} name="Low" variant={this.props.updateButtons(this.props.i, 'Low')} size="sm">Low</Button>
                    </div>
                ) : <MinMinSpinner />}
            </div>
        )
    }
}

export default Question
