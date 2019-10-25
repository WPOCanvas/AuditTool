import React, { Component } from 'react'
import { Card } from 'react-bootstrap';
import { Button} from 'react-bootstrap';
import { Link } from 'react-router-dom'


class UserAudit extends Component {
    render() {
        return (
   <section className="container">
       <h3 style={{textAlign:"center"}}>Recent Audits</h3>
        <div className="columns features">
            <div className="column is-3">
                <div className="card is-shady">
                    <div className="card-content">
                        <div className="content">
                            <h4>Audit Number 1</h4>
                            <p>99x</p>
                            <p>Super Office</p>
                            <p>2019-10-12</p>
                            <p>Average Score:6.73</p>
                            <p><Link to="/">See more</Link></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="column is-3">
                <div className="card is-shady">
                    <div className="card-content">
                        <div className="content">
                        <h4>Audit Number 2</h4>
                            <p>99x</p>
                            <p>ASPIIT</p>
                            <p>2019-09-22</p>
                            <p>Average Score:7.73</p>
                            <p><Link to="/">See more</Link></p> 
                        </div>
                    </div>
                </div>
            </div>
            <div className="column is-3">
                <div className="card is-shady">
                     <div className="card-content">
                        <div className="content">
                        <h4>Audit Number 3</h4>
                            <p>99x</p>
                            <p>DRIW</p>
                            <p>2019-09-15</p>
                            <p>Average Score:8.25</p>
                            <p><Link to="/">See more</Link></p> 
                        </div>
                    </div>
                </div>
            </div>
            <div className="column is-3">
                <div className="card is-shady">
                     <div className="card-content">
                        <div className="content">
                        <h4 style={{textAlign:"center"}}>Create New</h4>
                        <p><Link to="/auditQues"><h1 style={{textAlign:"center"}}>+</h1></Link></p> 
                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
        )
    }
}

export default UserAudit;

