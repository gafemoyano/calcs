import React, { Component } from 'react'
import Link from 'gatsby-link'
import CurrencyInput from 'react-currency-input'
import { SSL_OP_PKCS1_CHECK_1 } from 'constants'

class IndexPage extends Component {
  state = {
    homePrice: '315000',
    downPayment: '50000',
    downPaymentPercent: '',
    loanProgram: '30',
    interestRate: '4.368'
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  calculateMortage = () => {
    let homePrice = parseInt(this.state.homePrice, 10)
    let downPayment = parseInt(this.state.downPayment, 10)
    let loanProgram = parseInt(this.state.loanProgram, 10)

    console.log(homePrice)
    console.log(downPayment)
    console.log(loanProgram)

    let monthlyRate = this.monthlyRate()
    console.log(monthlyRate)

    let loanValue = homePrice - downPayment
    let pow = Math.pow(1 + monthlyRate, loanProgram * 12)
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
      <div className="mx-auto md:w-1/2">
        <h1 className="text-2xl mb-6">Mortgage Calculator </h1>
        <form>
          <label
            className="block font-bold text-grey-darker mb-2 text-xs uppercase"
            htmlFor="first-name"
          >
            What's the purchase price of the home?
          </label>
          <input
            className="appearance-none block bg-yellow-lighter mb-6 p-3 rounded-md text-grey-darker w-full"
            precision="0"
            name="homePrice"
            value={this.state.homePrice}
            onChange={this.handleChange}
          />
          <label
            className="block font-bold text-grey-darker mb-2 text-xs uppercase"
            htmlFor="last-name"
          >
            How much do you want to put down?
          </label>
          <input
            className="appearance-none block bg-yellow-lighter mb-6 p-3 rounded-md text-grey-darker w-full"
            id="last-name"
            type="number"
            min="0"
            placeholder="$30.000"
            name="downPayment"
            value={this.state.downPayment}
            onChange={this.handleChange}
          />
          <label
            className="block font-bold text-grey-darker mb-2 text-xs uppercase"
            htmlFor="zip-code"
          >
            What's your loan program in years?
          </label>
          <input
            className="appearance-none block bg-yellow-lighter mb-6 p-3 rounded-md text-grey-darker w-full"
            id="loanProgram"
            type="number"
            min="0"
            placeholder="1"
            name="loanProgram"
            value={this.state.loanProgram}
            onChange={this.handleChange}
          />
          <label
            className="block font-bold text-grey-darker mb-2 text-xs uppercase"
            htmlFor="credit"
          >
            What's your interest rate?
          </label>
          <input
            className="appearance-none block bg-yellow-lighter mb-6 p-3 rounded-md text-grey-darker w-full"
            id="loanProgram"
            type="text"
            min="0"
            name="interestRate"
            value={this.state.interestRate}
            onChange={this.handleChange}
          />
          <div className="my-16 border-yellow border-style-solid border-4 p-2">
            <label
              className="block font-bold text-grey-darkest mb-2 text-xl uppercase"
              htmlFor="credit"
            >
              Your monthly rate
            </label>
            <div className="font-bold text-grey-darkest text-3xl">
              ${mortage}
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default IndexPage
