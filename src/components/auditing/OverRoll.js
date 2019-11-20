import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import { API } from 'aws-amplify';
import { Card, CardGroup } from 'react-bootstrap';
import Spinner from '../utility/Spinner.js';

class OveRoll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      charts: [],
      loading: false,
      errors: {
        cognito: null,
        blankfield: false
      }
    };
  }

  fetchProgress = async () => {
    this.setState(() => {
      return {loading : true}
   });
    try {
      let items = await API.get(
        'ProgressApi',
        '/progress/Progress-' +
          this.props.location.state.productName +
          '-' +
          this.props.location.state.auditDate +
          '-' +
          this.props.user.attributes['custom:organization']
      );
      return items;
    } catch (error) {
      let err = null;
      !error.message ? (err = { message: error }) : (err = error);
      this.setState({
        errors: {
          ...this.state.errors,
          cognito: err
        }
      });
    }
  };

  drawCharts = () => {
    let charts = this.state.items.map(row => {
      const Low = (row.Low * 100 / row.fullQuestions).toFixed(2);
      const Medium = (row.Medium * 100 / row.fullQuestions).toFixed(2);
      const High = (row.High * 100 / row.fullQuestions).toFixed(2);
      return {
        name: row.section,
        series: [High, Medium, Low],
        options: {
          labels: ['High', 'Medium', 'Low'],
          plotOptions: {
            radialBar: {
              offsetY: -10,
              startAngle: 0,
              endAngle: 270,
              dataLabels: {
                name: {
                  fontSize: '22px'
                },
                value: {
                  fontSize: '16px'
                }
              }
            }
          },
          legend: {
            show: true,
            floating: true,
            fontSize: '16px',
            position: 'left',
            offsetX: 80,
            offsetY: 10,
            labels: {
              useSeriesColors: true
            },
            markers: {
              size: 0
            },
            formatter: function(seriesName, opts) {
              return (
                seriesName + ':  ' + opts.w.globals.series[opts.seriesIndex]
              );
            },
            itemMargin: {
              horizontal: 1
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    show: false
                  }
                }
              }
            ]
          }
        }
      };
    });
    this.setState({ charts , loading: false });
  };

  async componentDidMount() {
    let items = await this.fetchProgress();
    this.setState({ items });
    this.drawCharts();
  }

  render() {
    return (
      <div>
        {!this.state.loading ? (
          <section className='container'>
            <h3 className='align-center'>Over-Roll Score</h3>
            <CardGroup>
              {this.state.charts.map((chart, i) => {
                return (
                  <div key={i} className='col-sm-6 p-20'>
                    <Card>
                      <Card.Header>
                        <h4>{chart.name}</h4>
                      </Card.Header>
                      <Card.Body>
                        <Chart
                          options={chart.options}
                          series={chart.series}
                          type='radialBar'
                          height='250'
                        />
                      </Card.Body>
                    </Card>
                  </div>
                );
              })}
            </CardGroup>
          </section>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

export default OveRoll;
