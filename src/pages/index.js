import React, { Component } from "react";
import Link from "gatsby-link";
import CurrencyInput from "react-currency-input";
import InputRange from "react-input-range";
import InputGroup from "../components/InputGroup";
import "./input-range.css";
import { VictoryPie, VictoryLabel } from "victory";

class IndexPage extends Component {
  state = {
    mortgageLoan: 90000,
    term: 15,
    interestRate: 6
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleMortgageLoanChange = event => {
    let newValue = this.state.mortgageLoan;
    const value = event.target.value;
    if (value !== null) {
      if (value.length > 0) {
        if (!isNaN(value)) {
          newValue = parseInt(value);
        }
      }
    }
    newValue = newValue.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    this.setState({
      [event.target.name]: newValue
    });
  };

  calculateMortage = () => {
    let mortgageLoan = parseInt(this.state.mortgageLoan, 10);
    let term = parseInt(this.state.term, 10);
    let monthlyRate = this.monthlyRate();

    let pow = Math.pow(1 + monthlyRate, term * 12);
    let mortage = mortgageLoan * ((monthlyRate * pow) / (pow - 1));
    if (mortage !== null && mortage !== undefined && mortage !== NaN) {
      return mortage;
    } else {
      return 0;
    }
  };
  formatText = event => {
    const currentValue = parseInt(event.currentTarget.value, 10);
    this.setState({
      [event.currentTarget.name]: currentValue
        .toFixed()
        .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
    });
  };

  totalInterest = () => {
    let interestRate = parseFloat(this.state.interestRate / 12) / 100;
    let mortgageLoan = parseInt(this.state.mortgageLoan, 10);
    let payments = this.state.term * 12;
    let monthlyAmount = this.calculateMortage();
    let principal = [];
    let totalInterest = 0;
    for (var i = 1; i <= payments; i++) {
      let interestPaid = mortgageLoan * interestRate;
      let principalPaid = monthlyAmount - interestPaid;
      mortgageLoan = mortgageLoan - principalPaid;
      totalInterest = totalInterest + interestPaid;
    }
    return parseInt(totalInterest, 10);
  };

  interestOnlyMortgagePayment = () => {
    let interestRate = parseFloat(this.state.interestRate / 12) / 100;
    let mortgageLoan = parseInt(this.state.mortgageLoan, 10);
    let monthlyAmount = this.calculateMortage();
    let interestPaid = mortgageLoan * interestRate;

    return parseInt(interestPaid, 10);
  };

  monthlyRate() {
    let interestRate = parseFloat(this.state.interestRate);
    return interestRate / 100 / parseFloat(12);
  }

  render() {
    let { mortgageLoan, term, interestRate } = this.state;
    // let mortgageLoan = parseInt(this.state.mortgageLoan.replace(/,/g, ''), 10)
    let mortage = parseInt(this.calculateMortage(), 10);
    let totalInterest = this.totalInterest();
    let totalLoan = totalInterest + mortgageLoan;
    let pmt = this.interestOnlyMortgagePayment();
    let principalPercentage = `${(mortgageLoan / totalLoan).toFixed(3) *
      100} %`;
    let loanPercentage = `${(totalInterest / totalLoan).toFixed(3) * 100} %`;

    return (
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl text-grey mb-8">
          Estimate Your Monthly Mortgage Payments
        </h2>

        <div className="block md:flex flex-row  -mx-4">
          <div className="w-100 md:w-1/2 px-4">
            <form>
              <div className="mb-4 flex items-center">
                <div className="w-1/3">
                  <label
                    className="block font-bold text-grey-darker mb-2 text-xs uppercase pr-8 text-right"
                    htmlFor="mortgageLoan"
                  >
                    Mortgage Loan
                  </label>
                </div>
                <div className="w-1/3">
                  <InputRange
                    minValue={0}
                    maxValue={2000000}
                    name="homeRange"
                    value={mortgageLoan}
                    onChange={value => {
                      this.setState({ mortgageLoan: value });
                    }}
                    className="block bg-yellow-lighter mb-6 p-3 rounded-md text-grey-darker w-full"
                  />
                </div>
                <div className="w-1/3 ml-8">
                  <div className="flex items-stretch relative w-full">
                    <div className="-mr-px flex">
                      <div
                        className="items-center flex leading-normal text-center whitespace-no-wrap bg-grey-light rounded-sm"
                        style={{ padding: ".375rem .75rem" }}
                      >
                        $
                      </div>
                    </div>
                    <CurrencyInput
                      className="relative appearance-none bg-yellow-lighter p-3 rounded-md text-grey-darker w-full pl-4"
                      style={{ flex: "1 1 auto" }}
                      name="mortgageLoan"
                      value={this.state.mortgageLoan}
                      onChangeEvent={this.handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-4 flex items-center">
                <div className="w-1/3">
                  <label
                    className="block font-bold text-grey-darker mb-2 text-xs uppercase  pr-8  text-right"
                    htmlFor="zip-code"
                  >
                    Term
                  </label>
                </div>
                <div className="w-1/3">
                  <InputRange
                    minValue={10}
                    maxValue={30}
                    name="term"
                    value={this.state.term}
                    onChange={value => {
                      this.setState({ term: value });
                    }}
                    className="block bg-yellow-lighter mb-6 p-3 rounded-md text-grey-darker w-full"
                  />
                </div>
                <div className="w-1/3 ml-8">
                  <div className="flex items-stretch relative w-full">
                    <div className="-mr-px flex" />
                    <input
                      className="appearance-none block bg-yellow-lighter p-3 rounded-md text-grey-darker w-full"
                      id="term"
                      type="number"
                      min="10"
                      max="30"
                      placeholder="10"
                      name="term"
                      value={this.state.term}
                      onChange={this.handleChange}
                    />
                    <div
                      className="items-center flex leading-normal text-center whitespace-no-wrap bg-grey-light rounded-sm"
                      style={{ padding: ".375rem .75rem" }}
                    >
                      Years
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center">
                <div className="w-1/3">
                  <label
                    className="block font-bold text-grey-darker mb-2 text-xs uppercase pr-8 text-right"
                    htmlFor="credit"
                  >
                    APR
                  </label>
                </div>
                <div className="w-1/3">
                  <InputRange
                    minValue={4}
                    maxValue={7}
                    step={0.01}
                    name="term"
                    value={this.state.interestRate}
                    onChange={value => {
                      this.setState({ interestRate: value });
                    }}
                    className="block bg-yellow-lighter mb-6 p-3 rounded-md text-grey-darker w-full"
                  />
                </div>
                <div className="w-1/3 ml-8">
                  <div className="flex items-stretch relative w-full">
                    <div className="-mr-px flex" />
                    <input
                      className="appearance-none block bg-yellow-lighter p-3 rounded-md text-grey-darker w-full"
                      id="term"
                      type="number"
                      min="4"
                      max="7"
                      step="0.01"
                      name="interestRate"
                      value={this.state.interestRate}
                      onChange={this.handleChange}
                    />
                    <div
                      className="items-center flex leading-normal text-center whitespace-no-wrap bg-grey-light rounded-sm"
                      style={{ padding: ".375rem .75rem" }}
                    >
                      %
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="w-100 sm:w-1/2 px-4">
            <div className="max-w-xs mx-auto -mt-8">
              <svg viewBox="0 0 400 400">
                <VictoryPie
                  standalone={false}
                  colorScale={["#22292f", "#fdb714"]}
                  width={400}
                  height={400}
                  data={[
                    { x: "", y: parseInt(mortgageLoan, 10) },
                    { x: "", y: totalInterest }
                  ]}
                  innerRadius={68}
                  labelRadius={100}
                  style={{ labels: { fontSize: 20, fill: "white" } }}
                />
                <VictoryLabel
                  textAnchor="middle"
                  style={{ fontSize: 28, fontWeight: 500, fill: "#fdb714" }}
                  x={200}
                  y={200}
                  text={`$${mortage
                    .toFixed(2)
                    .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")}`}
                />
              </svg>
              <div className="block">
                <div className="flex justify-start mb-4">
                  <div className="items-center">
                    <div
                      className="rounded-full p-4 mr-3"
                      style={{ backgroundColor: "#22292f" }}
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-grey-darker text-xl">
                      Principal Loan Amount
                    </div>
                    <div className="text-yellow-dark-darkest text-xl font-semibold">
                      ${mortgageLoan
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")}
                      <span className="text-grey-dark ml-2 font-light">
                        {principalPercentage}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-start mb-4">
                  <div className="items-center">
                    <div
                      className="rounded-full p-4 mr-3"
                      style={{ backgroundColor: "#fdb714" }}
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-grey-darker text-xl">
                      Total Interest Amount
                    </div>
                    <div className="text-grey-darkest text-xl font-semibold">
                      ${totalInterest
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")}
                      <span className="text-grey-dark ml-2 font-light">
                        {loanPercentage}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-start mb-4">
                  <div className="items-center">
                    <div className="rounded-full p-4 mr-3 bg-grey" />
                  </div>
                  <div className="text-left">
                    <div className="text-grey-darker text-xl">
                      Interest-Only Mortgage Payment
                    </div>
                    <div className="text-yellow-dark-darkest text-xl font-semibold">
                      ${pmt.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")}
                    </div>
                  </div>
                </div>
                <div className="flex text-right">
                  <div className="ml-auto">
                    <div className="text-grey-darker text-xl font-semibold">
                      Total Loan Cost
                    </div>
                    <div className="text-grey-darkest text-2xl font-bold">
                      ${totalLoan
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+\.)/g, "$1,")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default IndexPage;
