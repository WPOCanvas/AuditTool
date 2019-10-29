import React, { Component } from 'react';
import UserAudit from '../../UserAudit'


class NewProduct extends Component {
    state = {
        productId: null
    }

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

export default NewProduct;
