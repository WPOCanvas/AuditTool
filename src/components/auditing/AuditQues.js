import React, { Component } from 'react';
import Specmodels from './specmodels';
import quesData from './data.json';
import SProgressBar from './sProgressBar';
import { Button } from 'react-bootstrap';
class AuditQues extends Component {

  state = {
    id : this.props.location.pathname.split('/')[2]
  }

  OverRoll = () => {
    this.props.history.push('/OverRoll/' + this.state.id);
  }

  modelData = quesData;
  render() {
    return (
      <section className='container'>
        <div>
          <div className='progressBar'>
            <SProgressBar />
          </div>
          <h1 style={{ textAlign: 'center' }}>
            New Audit For {this.props.location.state.productName} Product{' '}
            {this.props.user.username} Company
          </h1>
          <br />
          <br />
          <h6>
            WPC canvas gives you 10 model phases for evaluate your product, what
            you have to do is go through all the 10 models and answer the given
            questions
          </h6>
          {this.modelData.areas.map((area, i) => {
            return (
              <Specmodels
                key={i}
                area={area}
                auditDate={this.props.location.state.auditDate}
                productName={this.props.location.state.productName}
                {...this.props}
              />
            );
          })}
          <div className='align-center p-20'>
            <Button onClick={this.OverRoll} varient='success'>Submit</Button>
          </div>
        </div>
      </section>
    );
  }
}
export default AuditQues;
