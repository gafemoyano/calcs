import React, { Component } from 'react'
import Link from 'gatsby-link'

class IndexPage extends Component {
  state = {
    homePrice: '300000',
    downPayment: '0',
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
    let mortage = loanValue * ((monthlyRate * pow) / pow - 1)
    if (mortage !== null && mortage !== undefined && mortage !== NaN) {
      return mortage
    } else {
      return 0
    }
  }

  monthlyRate() {
    let interestRate = parseFloat(this.state.interestRate)
    return interestRate / parseFloat(12)
  }

  render() {
    return (
      <form className="mx-auto md:w-1/2">
        <label
          className="block font-bold mb-2 text-xs uppercase"
          htmlFor="first-name">
          What's the purchase price of the home?
        </label>
        <input
          className="appearance-none block bg-grey-lighter mb-6 p-3 rounded-md text-grey-darker w-full"
          id="first-name"
          type="text"
          placeholder="$3.000.000"
          type="text"
          name="homePrice"
          value={this.state.homePrice}
          onChange={this.handleChange}
        />
        <label
          className="block font-bold mb-2 text-xs uppercase"
          htmlFor="last-name">
          How much do you want to put down?
        </label>
        <input
          className="appearance-none block bg-grey-lighter mb-6 p-3 rounded-md text-grey-darker w-full"
          id="last-name"
          type="text"
          placeholder="$30.000"
          name="downPayment"
          value={this.state.downPayment}
          onChange={this.handleChange}
        />
        <label
          className="block font-bold mb-2 text-xs uppercase"
          htmlFor="zip-code">
          What's your loan program in years?
        </label>
        <input
          className="appearance-none block bg-grey-lighter mb-6 p-3 rounded-md text-grey-darker w-full"
          id="loanProgram"
          type="text"
          placeholder="1"
          name="loanProgram"
          value={this.state.loanProgram}
          onChange={this.handleChange}
        />
        <label
          className="block font-bold mb-2 text-xs uppercase"
          htmlFor="credit">
          What's your interest rate?
        </label>
        <input
          className="appearance-none block bg-grey-lighter mb-6 p-3 rounded-md text-grey-darker w-full"
          id="loanProgram"
          type="text"
          placeholder="1"
          name="interestRate"
          value={this.state.interestRate}
          onChange={this.handleChange}
        />
        <div>{this.calculateMortage()}</div>
        <button className="border-b-4 border-grey-darker hover:border-grey-dark bg-grey-dark hover:bg-grey font-bold px-6 py-3 rounded text-sm text-white">
          Submit
        </button>
      </form>
    )
  }
}

export default IndexPage
