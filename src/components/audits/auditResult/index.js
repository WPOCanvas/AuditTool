import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';
import { API } from 'aws-amplify';
import { Card, CardGroup } from 'react-bootstrap';
import Spinner from '../../utility/Spinner';
import { states } from '../auditData/states.json';
class AuditResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      charts: [],
      overRollChart: [],
      auditData : [],
      loading: false,
      errors: {
        cognito: null,
        blankfield: false
      }
    };
  }

  fetchProgress = async () => {
    this.setState(() => {
      return { loading: true };
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
    let mainChart = this.state.items
      .map(row => {
        return {
          High: row.High,
          Medium: row.Medium,
          Low: row.Low,
          qCount: row.fullQuestions
        };
      })
      .reduce(
        (pVal, cVal) => {
          return {
            High: pVal.High + cVal.High,
            Medium: pVal.Medium + cVal.Medium,
            Low: pVal.Low + cVal.Low,
            qCount: pVal.qCount + cVal.qCount
          };
        },
        { High: 0, Medium: 0, Low: 0, qCount: 0 }
      );
    const colors = ['#00E396', '#FEB019', '#FF4560'];
    const Low = ((mainChart.Low * 100) / mainChart.qCount).toFixed(0);
    const Medium = ((mainChart.Medium * 100) / mainChart.qCount).toFixed(0);
    const High = ((mainChart.High * 100) / mainChart.qCount).toFixed(0);
    let overRollChart = [
      {
        name: 'OverRoll',
        series: [{ name: 'Score', data: [High, Medium, Low] }],
        options: {
          dataLabels: {
            enabled: false
          },
          xaxis: {
            categories: ['High', 'Medium', 'Low'],
            labels: {
              style: {
                colors: colors,
                fontSize: '14px'
              }
            }
          },
          yaxis: {
            title: {
              text: 'overroll-points',
              style: {
                colors: '#775DD0',
                fontSize: '14px'
              }
            }
          },
          colors: colors,
          plotOptions: {
            bar: {
              columnWidth: '20%',
              distributed: true
            }
          },
          fill: {
            opacity: 1
          },
          legend: {
            position: 'right',
            offsetX: 0,
            offsetY: 50
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: 'bottom',
                  offsetX: -10,
                  offsetY: 0
                }
              }
            }
          ]
        }
      }
    ];
    this.setState({ overRollChart, loading: false });
  };

  fetchItems = async () => {
    this.setState({ loading: true });
    const promise = states.map(async state => {
      try {
        let items = await API.get(
          'ItemApi',
          '/items/Item-' +
            this.props.location.state.productName +
            '-' +
            this.props.location.state.auditDate +
            '-' +
            state +
            '-' +
            this.props.user.attributes['custom:organization'] +
            '/Audit-'
        );
        let val = {
          name: state,
          values: items
        };
        return val;
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
    });
    return await Promise.all(promise);
  };

  async componentDidMount() {
    let items = await this.fetchProgress();
    let auditData = await this.fetchItems();
    this.setState({ items , auditData });
    this.drawCharts();
  }

  render() {
    return (
      <div>
        {!this.state.loading ? (
          <section className='container'>
            <h3 className='align-center'>Over-Roll Score</h3>
            <CardGroup>
              <Card>
                <Card.Header>
                  {this.state.overRollChart.length
                    ? this.state.overRollChart[0].name
                    : null}
                </Card.Header>
                <div style={{ flexDirection: 'row', display: 'flex' }}>
                  <div className='col-lg-4 col-md-4 col-sm-6 col-xs-6 p-20'>
                    <Card className='summeryCard'>
                      <Card.Header>Summery</Card.Header>
                      <Card.Body>
                        <p>
                          High :{' '}
                          {this.state.overRollChart.length
                            ? this.state.overRollChart[0].series[0].data[0]+'%'
                            : null}
                        </p>
                        <br />
                        <p>
                          Medium :{' '}
                          {this.state.overRollChart.length
                            ? this.state.overRollChart[0].series[0].data[1]+'%'
                            : null}
                        </p>
                        <br />
                        <p>
                          Low :{' '}
                          {this.state.overRollChart.length
                            ? this.state.overRollChart[0].series[0].data[2]+'%'
                            : null}
                        </p>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className='col-lg-8 col-md-8 col-sm-6 col-xs-6 p-20'>
                    <Card>
                      <Card.Body>
                        {this.state.overRollChart.map((chart, i) => {
                          return (
                            <ReactApexChart
                              key={i}
                              options={chart.options}
                              series={chart.series}
                              type='bar'
                              height='350'
                            />
                          );
                        })}
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </Card>
            </CardGroup>
          </section>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

export default AuditResult;
