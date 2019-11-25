import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { API } from "aws-amplify";
import { MinMinSpinner } from "../utility/Spinner";
import { progressBarService } from "../../services/ProgressBar.service";
export class Question extends Component {
  state = {
    loading: false,
    errors: {
      cognito: null,
      blankfield: false
    }
  };

  switch = {
    Low: 1,
    Medium: 2,
    High: 3
  };

  switchReverse = {
    1: "Low",
    2: "Medium",
    3: "High"
  };

  sendStatus() {
    progressBarService.sendStatus(1);
  }

  updateItem = async event => {
    this.setState({ loading: true });
    let updateItem = this.props.items.find(
      item =>
        item.id === this.props.id && item.qid === Number(event.target.value)
    );
    let updateProgress = this.props.progress[0];
    if (Number(updateItem.score) === 0) {
      this.sendStatus();
      ++updateProgress[event.target.name];
      ++updateProgress.questionCount;
    } else {
      --updateProgress[this.switchReverse[updateItem.score]];
      ++updateProgress[event.target.name];
    }
    if (updateProgress.questionCount === this.props.items.length) {
      updateProgress.done = "true";
    }
    updateProgress.score =
      updateProgress.score +
      Number(this.switch[event.target.name]) -
      updateItem.score;
    updateItem.score = this.switch[event.target.name];
    try {
      await API.put("ItemApi", "/items", {
        body: updateItem
      });
      await API.put("ProgressApi", "/progress", {
        body: updateProgress
      });
    } catch (error) {
      let err = null;
      !error.message ? (err = { message: error }) : (err = error);
      this.setState({
        loading: false,
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <div>
        {!this.state.loading ? (
          <div className="row">
            <div style={{ padding: "3px" }}>
              <Button
                onClick={this.updateItem}
                value={this.props.i}
                name="High"
                variant={this.props.updateButtons(this.props.i, "High")}
                size="sm"
                style={{ width: "120px" }}
              >
                Comply
              </Button>
            </div>
            <div style={{ padding: "3px" }}>
              <Button
                onClick={this.updateItem}
                value={this.props.i}
                name="Medium"
                variant={this.props.updateButtons(this.props.i, "Medium")}
                size="sm"
                style={{ width: "120px" }}
              >
                Partially Comply
              </Button>
            </div>

            <div style={{ padding: "3px" }}>
              <Button
                onClick={this.updateItem}
                value={this.props.i}
                name="Low"
                variant={this.props.updateButtons(this.props.i, "Low")}
                size="sm"
                style={{ width: "120px" }}
              >
                Not Comply
              </Button>
            </div>
          </div>
        ) : (
          <MinMinSpinner />
        )}
      </div>
    );
  }
}

export default Question;
