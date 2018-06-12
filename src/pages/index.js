import React, { Component } from 'react'
import Link from 'gatsby-link'
import CurrencyInput from 'react-currency-input'
import InputRange from 'react-input-range'
import InputGroup from '../components/InputGroup'
import './input-range.css'
import { VictoryPie, VictoryLabel } from 'victory'

class IndexPage extends Component {
  state = {
    homePrice: '315000',
    downPayment: '50000',
    downPaymentPercent: '',
    term: '30',
    interestRate: 4
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  calculateMortage = () => {
    let homePrice = parseInt(this.state.homePrice, 10)
    let downPayment = parseInt(this.state.downPayment, 10)
    let term = parseInt(this.state.term, 10)

    console.log(homePrice)
    console.log(downPayment)
    console.log(term)

    let monthlyRate = this.monthlyRate()
    console.log(monthlyRate)

    let loanValue = homePrice - downPayment
    let pow = Math.pow(1 + monthlyRate, term * 12)
    let mortage = loanValue * ((monthlyRate * pow) / (pow - 1))
    if (mortage !== null && mortage !== undefined && mortage !== NaN) {
      return mortage
    } else {
      return 0
    }
  }

  monthlyRate() {
    let interestRate = parseFloat(this.state.interestRate)
    return interestRate / 100 / parseFloat(12)
  }

  render() {
    let mortage = this.calculateMortage()
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
                    htmlFor="homePrice"
                  >
                    Home price
                  </label>
                </div>
                <div className="w-1/3">
                  <InputRange
                    minValue={0}
                    maxValue={2000000}
                    name="homeRange"
                    value={this.state.homePrice}
                    onChange={value => {
                      this.setState({ homePrice: value })
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
                      name="homePrice"
                      value={this.state.homePrice}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center">
                <div className="w-1/3">
                  <label
                    className="block font-bold text-grey-darker mb-2 text-xs uppercase pr-8 text-right"
                    htmlFor="last-name"
                  >
                    Down Payment
                  </label>
                </div>
                <div className="w-1/3">
                  <InputRange
                    minValue={0}
                    maxValue={2000000}
                    name="downPayment"
                    value={this.state.downPayment}
                    onChange={value => {
                      this.setState({ downPayment: value })
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
                      className="appearance-none block bg-yellow-lighter p-3 rounded-md text-grey-darker w-full"
                      id="last-name"
                      type="number"
                      min="0"
                      placeholder="$30.000"
                      name="downPayment"
                      value={this.state.downPayment}
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
            <svg viewBox="0 0 400 400">
              <VictoryPie
                standalone={false}
                width={400}
                height={400}
                data={[{ x: 1, y: 120 }, { x: 2, y: 150 }, { x: 3, y: 75 }]}
                innerRadius={68}
                labelRadius={100}
                style={{ labels: { fontSize: 20, fill: 'white' } }}
              />
              <VictoryLabel
                textAnchor="middle"
                style={{ fontSize: 20 }}
                x={200}
                y={200}
                text={`$${mortage
                  .toFixed(2)
                  .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`}
              />
            </svg>
          </div>
        </div>
      </div>
    )
  }
}

export default IndexPage
