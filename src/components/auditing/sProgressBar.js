import React, { Component } from 'react';
import { API } from "aws-amplify";
import { ProgressBar } from "react-bootstrap";

class sProgressBar extends Component {
    constructor(props){
      super(props)

      this.state={
        valuess:0,
        stage: this.props.stage.replace('.', ' ').split(/ /g)[1],
        errors: {
            cognito: null,
            blankfield: false
          }
      }
    }

    async componentDidMount(){
        let items = await API.get("ItemApi", '/items/Item-' + this.props.productName + '-' + this.props.auditDate + '-' + this.state.stage + '-' + this.props.user.attributes['custom:organization'] + '/Audit-');
        let zeroItems=items.filter(item=>item.score!==0);
  
        let valuepercentage= ((zeroItems.length)/9)*100
       this.setState({
        valuess:valuepercentage
       })
    }
    
    render() {
        let progressValue=this.state.valuess;
        console.log(this.state.valuess)
        return (
           <ProgressBar animated now={progressValue} />
        );
    }
}

export default sProgressBar;
