import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { progressBarService } from '../../services/ProgressBar.service';
class sProgressBar extends Component {
  state = {
    value: 0,
    itemCount: 0,
  };

  componentDidMount() {
    this.subscriptionValue = progressBarService.getStatus().subscribe(value => {
        if (value) {
          this.setState(prevState => {
            return {value: prevState.value + value.number}
         });
        } else {
            this.setState({ value: 0 });
        }
    });

    this.subscriptionItem = progressBarService.getItemCount().subscribe(count => {
      console.log(count)
      if (count) {
        this.setState( () => {
          return {itemCount: count.number}
       });
      } else {
          this.setState({ itemCount: 0 });
      }
  });
}

componentWillUnmount() {
  // unsubscribe to ensure no memory leaks
  this.subscriptionValue.unsubscribe();
  this.subscriptionItem.unsubscribe();
}

  render() {
    let progressValue = this.state.value / this.state.itemCount;
    return <ProgressBar animated  variant="#3194ff" now={progressValue * 100} />
  }
}

export default sProgressBar;
