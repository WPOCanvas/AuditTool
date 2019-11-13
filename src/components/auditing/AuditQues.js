import React, { Component } from "react";
import Specmodels from './specmodels';
import quesData from './data.json'

class AuditQues extends Component {
  modelData = quesData;

  componentDidMount(){
   
  }
  render() {
    return (
      <section className="container">
        <h1 style={{ textAlign: "center" }}>New Audit For {this.props.location.state.productName} Product {this.props.user.username} Company</h1>
        <br />
        <br />
        <h6>WPC canvas gives you 10 model phases for evaluate your product, what you have to do is go through all the 10 models and answer the given questions</h6>
        {this.modelData.areas.map((area, i) => {
          return <Specmodels key={i} area={area} auditDate={ this.props.location.state.auditDate} productName={this.props.location.state.productName} {...this.props} />
        })}

      </section>
    );
  }
}
export default AuditQues;
