import React, { Component } from "react";
import { Accordion } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Specmodels from './specmodels';
import quesData from './data.json'


class AuditQues extends Component {
  modelData=quesData;
  render() {
    return (
      
    <section className="container">
      {this.modelData.areas.map((area , i)=>{
         return <Specmodels key={i} area={area} />
       })}
        
      </section>
    );
  }
}
export default AuditQues;
