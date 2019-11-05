import React, { Component } from 'react';
import UserAudit from '../../UserAudit'
class SingleProduct extends Component {
    render() {
        return (
            <section className="section auth">
                <div className="container">
                    <UserAudit {...this.props} />
                </div>
            </section>
        );
    }
}

export default SingleProduct;
