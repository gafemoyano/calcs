import React, {Component} from 'react'

var App = React.createClass({
  getInitialState() {
    return {
      donutval: 55
    }
  },
  updateVal(e) {
    this.setState({ donutval: e.target.value })
  },
  render() {
    return (
      <div>
        <DonutChart value={this.state.donutval} />
        <br />
        <label>Enter a value from 1-100<br />
          <input onChange={this.updateVal} type="number" min="0" max="100" />
        </label>
      </div>
    )
  }
});


class DonutChart extends Component({
  propTypes: {
    value: React.PropTypes.number,        // value the chart should show
    valuelabel: React.PropTypes.string,   // label for the chart
    size: React.PropTypes.number,         // diameter of chart
    strokewidth: React.PropTypes.number   // width of chart line
  },
  getDefaultProps() {
    return {
      value: 0,
      valuelabel: 'Completed',
      size: 116,
      strokewidth: 26
    };
  },
  render() {

    const halfsize = (this.props.size * 0.5);
    const radius = halfsize - (this.props.strokewidth * 0.5);
    const circumference = 2 * Math.PI * radius;
    const strokeval = ((this.props.value * circumference) / 100);
    const dashval = (strokeval + ' ' + circumference);

    const trackstyle = { strokeWidth: this.props.strokewidth };
    const indicatorstyle = { strokeWidth: this.props.strokewidth, strokeDasharray: dashval }
    const rotateval = 'rotate(-90 ' + halfsize + ',' + halfsize + ')';

    return (
      <svg width={this.props.size} height={this.props.size} className="donutchart">
        <circle r={radius} cx={halfsize} cy={halfsize} transform={rotateval} style={trackstyle} className="donutchart-track" />
        <circle r={radius} cx={halfsize} cy={halfsize} transform={rotateval} style={indicatorstyle} className="donutchart-indicator" />
        <text className="donutchart-text" x={halfsize} y={halfsize} style={{ textAnchor: 'middle' }} >
          <tspan className="donutchart-text-val">{this.props.value}</tspan>
          <tspan className="donutchart-text-percent">%</tspan>
          <tspan className="donutchart-text-label" x={halfsize} y={halfsize + 10}>{this.props.valuelabel}</tspan>
        </text>
      </svg>
    );
  }
})



export default DonutChart
