import React, { Component } from 'react'
import Loader from 'react-loader-spinner'

export default class Spinner extends Component {
    render () {
        return (
            <div className="spinner">
                  <Loader color="#00d1b2" width={100} height={100} type="Triangle" />
            </div>
          )
    }
}

export class MinSpinner extends Component {
    render () {
        return (
            <div className="min-spinner">
                  <Loader color="#00d1b2" width={100} height={100} type="Triangle" />
            </div>
          )
    }
}