import React, { Component } from 'react'
import Link from 'gatsby-link'
import CurrencyInput from 'react-currency-input'
import InputRange from 'react-input-range'
import InputGroup from '../components/InputGroup'
import './input-range.css'
import { VictoryPie, VictoryLabel } from 'victory'

class IndexPage extends Component {
  state = {
    mortgageLoan: 90000,
    term: 15,
    interestRate: 6
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  calculateMortage = () => {
    let mortgageLoan = parseInt(this.state.mortgageLoan, 10)
    let term = parseInt(this.state.term, 10)
    let monthlyRate = this.monthlyRate()

    let pow = Math.pow(1 + monthlyRate, term * 12)
    let mortage = mortgageLoan * ((monthlyRate * pow) / (pow - 1))
    if (mortage !== null && mortage !== undefined && mortage !== NaN) {
      return mortage
    } else {
      return 0
    }
  }

  totalInterest = () => {
    let interestRate = parseFloat(this.state.interestRate / 12) / 100
    let mortgageLoan = parseInt(this.state.mortgageLoan, 10)
    let payments = this.state.term * 12
    let monthlyAmount = this.calculateMortage()
    let principal = []
    let totalInterest = 0
    for (var i = 1; i <= payments; i++) {
      let interestPaid = mortgageLoan * interestRate
      let principalPaid = monthlyAmount - interestPaid
      mortgageLoan = mortgageLoan - principalPaid
      totalInterest = totalInterest + interestPaid
    }
    return parseInt(totalInterest, 10)
  }

  monthlyRate() {
    let interestRate = parseFloat(this.state.interestRate)
    return interestRate / 100 / parseFloat(12)
  }

  render() {
    let { mortgageLoan, downPayment, term, interestRate } = this.state
    let mortage = parseInt(this.calculateMortage(), 10)
    let totalInterest = this.totalInterest()
    let totalLoan = totalInterest + mortgageLoan

    return (
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl mb-6">Calculator </h1>
        <h2 className="text-xl text-grey mb-8">
          Estimate your monthly mortgage payments.
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
                    Mortage Loan
                  </label>
                </div>
                <div className="w-1/3">
                  <InputRange
                    minValue={0}
                    maxValue={2000000}
                    name="homeRange"
                    value={this.state.mortgageLoan}
                    onChange={value => {
                      this.setState({ mortgageLoan: value })
                    }}
                    className="block bg-yellow-lighter mb-6 p-3 rounded-md text-grey-darker w-full"
                  />
                </div>
                <div className="w-1/3 ml-8">
                  <div className="flex items-stretch relative w-full">
                    <div className="-mr-px flex">
                      <div
                        className="items-center flex leading-normal text-center whitespace-no-wrap bg-grey-light rounded-sm"
                        style={{ padding: '.375rem .75rem' }}
                      >
                        $
                      </div>
                    </div>
                    <input
                      className="relative appearance-none bg-yellow-lighter p-3 rounded-md text-grey-darker w-full pl-4"
                      style={{ flex: '1 1 auto' }}
                      precision="0"
                      name="mortgageLoan"
                      value={this.state.mortgageLoan}
                      onChange={this.handleChange}
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
                      this.setState({ term: value })
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
                      min="30"
                      placeholder="10"
                      name="term"
                      value={this.state.term}
                      onChange={this.handleChange}
                    />
                    <div
                      className="items-center flex leading-normal text-center whitespace-no-wrap bg-grey-light rounded-sm"
                      style={{ padding: '.375rem .75rem' }}
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
                      this.setState({ interestRate: value })
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
                      min="2"
                      min="7"
                      step="0.01"
                      name="interestRate"
                      value={this.state.interestRate}
                      onChange={this.handleChange}
                    />
                    <div
                      className="items-center flex leading-normal text-center whitespace-no-wrap bg-grey-light rounded-sm"
                      style={{ padding: '.375rem .75rem' }}
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
                  colorScale={['#fdb714', '#b8c2cc']}
                  width={400}
                  height={400}
                  data={[
                    { x: '', y: parseInt(mortgageLoan, 10) },
                    { x: '', y: totalInterest }
                  ]}
                  innerRadius={68}
                  labelRadius={100}
                  style={{ labels: { fontSize: 20, fill: 'white' } }}
                />
                <VictoryLabel
                  textAnchor="middle"
                  style={{ fontSize: 25, fontWeight: 500 }}
                  x={200}
                  y={200}
                  text={`$${mortage
                    .toFixed(2)
                    .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`}
                />
              </svg>
              <div className="block">
                <div className="flex justify-between mb-4">
                  <div className="items-center">
                    <div
                      className="rounded-full p-4"
                      style={{ backgroundColor: '#fdb714' }}
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-grey-darker text-2xl">
                      Principal loan ammount
                    </div>
                    <div className="text-grey-darkest text-2xl text-bold">
                      ${mortgageLoan
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mb-4">
                  <div className="items-center">
                    <div className="rounded-full p-4 bg-grey" />
                  </div>
                  <div className="text-left">
                    <div className="text-grey-darker text-2xl">
                      Total interest ammount
                    </div>
                    <div className="text-grey-darkest text-2xl text-bold">
                      ${totalInterest
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
                    </div>
                  </div>
                </div>
                <div className="flex text-right">
                  <div className="ml-auto">
                    <div className="text-grey-darker text-2xl font-semibold">
                      Total loan cost
                    </div>
                    <div className="text-grey-darkest text-2xl font-bold">
                      ${totalLoan
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default IndexPage
