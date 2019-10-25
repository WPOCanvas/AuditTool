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
    <h1 style={{textAlign:"center"}}>New Audit For ABC Product XyZ Technologies</h1>
    <br/>
    <br/>
    <h6>WPC canvas gives you 16 model phases for evaluate your product, what you have to do is go through all the 16 models and answer the given questions</h6>
      {this.modelData.areas.map((area , i)=>{
         return <Specmodels key={i} area={area} />
       })}
        
      </section>
    );
  }
}
export default AuditQues;
