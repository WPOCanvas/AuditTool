import React, { Component , Fragment} from 'react';
import Hero from './Hero';

class Home extends Component {
  render() {
    return (
      <Fragment>
        <Hero />
        <div className="box cta">
          <p className="has-text-centered">
            WPO audit tool
          </p>
        </div>
      </Fragment>
    )
  }
}

export default Home;