import React, { Component } from 'react'
import CurrencyInput from 'react-currency-input'
import InputRange from 'react-input-range'
import './input-range.css'

class RentVsBuy extends Component {
  state = {
    monthlyRent: 1900,
    propertyTaxes: 4000,
    propertyInsurance: 3000,
    interestRate: 5,
    percentageDown: 10
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleMortgageLoanChange = event => {
    let newValue = this.state.mortgageLoan
    const value = event.target.value
    if (value !== null) {
      if (value.length > 0) {
        if (!isNaN(value)) {
          newValue = parseInt(value)
        }
      }
    }
    newValue = newValue.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    this.setState({
      [event.target.name]: newValue
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

  presentValue = () => {
    let { propertyInsurance, propertyTaxes, monthlyRent } = this.state
    let monthlyRate = this.monthlyRate()
    let pmt = monthlyRent - (propertyInsurance / 12 + propertyTaxes / 12)
    let presentValue =
      pmt *
      Math.pow(1 + monthlyRate, -360) *
      ((Math.pow(1 + monthlyRate, 360) - 1) / monthlyRate)
    return presentValue
  }

  monthlyRate() {
    let interestRate = parseFloat(this.state.interestRate)
    return interestRate / 100 / parseFloat(12)
  }

  render() {
    let {
      monthlyRent,
      propertyTaxes,
      propertyInsurance,
      interestRate,
      percentageDown
    } = this.state
    let presentValue = this.presentValue()
    let valueForPurchase = presentValue / (1 - percentageDown / 100)

    return (
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-xl text-grey mb-8">
          Decide Between Buying a Home or Renting
        </h1>
        <div className="block md:flex flex-row  -mx-4">
          <div className="w-100 px-4">
            <form>
              <div className="mb-4 flex items-center">
                <div className="w-1/3">
                  <label
                    className="block font-bold text-grey-darker mb-2 text-xs uppercase pr-8 text-right"
                    htmlFor="monthlyRent"
                  >
                    How much are you currently paying in rent?
                  </label>
                </div>
                <div className="w-1/3">
                  <InputRange
                    minValue={0}
                    maxValue={20000}
                    name="monthlyRent"
                    value={monthlyRent}
                    onChange={value => {
                      this.setState({ monthlyRent: value })
                    }}
                    className="block bg-yellow-dark font-semibold mb-6 p-3 rounded-md text-grey-darker w-full"
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
                    <CurrencyInput
                      className="relative appearance-none bg-yellow-dark font-semibold p-3 rounded-md text-grey-darker w-full pl-4"
                      style={{ flex: '1 1 auto' }}
                      name="monthlyRent"
                      value={this.state.monthlyRent}
                      onChangeEvent={this.handleChange}
                    />
                  </div>
                </div>
              </div>
              <h4 className="mb-4 text-grey-dark font-bold text-md ">
                What do you estimate Property Taxes and Insurance on the
                property you are looking to purchase?
              </h4>
              <div className="mb-4 flex items-center">
                <div className="w-1/3">
                  <label
                    className="block font-bold text-grey-darker mb-2 text-xs uppercase pr-8 text-right"
                    htmlFor="propertyTaxes"
                  >
                    Property Taxes
                  </label>
                </div>
                <div className="w-1/3">
                  <InputRange
                    minValue={0}
                    maxValue={20000}
                    name="propertyTaxes"
                    value={propertyTaxes}
                    onChange={value => {
                      this.setState({ propertyTaxes: value })
                    }}
                    className="block bg-yellow-dark font-semibold mb-6 p-3 rounded-md text-grey-darker w-full"
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
                    <CurrencyInput
                      className="relative appearance-none bg-yellow-dark font-semibold p-3 rounded-md text-grey-darker w-full pl-4"
                      style={{ flex: '1 1 auto' }}
                      name="propertyTaxes"
                      value={this.state.propertyTaxes}
                      onChangeEvent={this.handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-4 flex items-center">
                <div className="w-1/3">
                  <label
                    className="block font-bold text-grey-darker mb-2 text-xs uppercase pr-8 text-right"
                    htmlFor="propertyTaxes"
                  >
                    Property Insurance
                  </label>
                </div>
                <div className="w-1/3">
                  <InputRange
                    minValue={0}
                    maxValue={10000}
                    name="propertyInsurance"
                    value={propertyInsurance}
                    onChange={value => {
                      this.setState({ propertyInsurance: value })
                    }}
                    className="block bg-yellow-dark font-semibold mb-6 p-3 rounded-md text-grey-darker w-full"
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
                    <CurrencyInput
                      className="relative appearance-none bg-yellow-dark font-semibold p-3 rounded-md text-grey-darker w-full pl-4"
                      style={{ flex: '1 1 auto' }}
                      name="propertyInsurance"
                      value={this.state.propertyInsurance}
                      onChangeEvent={this.handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center">
                <div className="w-1/3">
                  <label
                    className="block font-bold text-grey-darker mb-2 text-xs uppercase pr-8 text-right"
                    htmlFor="interestRate"
                  >
                    Interest Rate
                  </label>
                </div>
                <div className="w-1/3">
                  <InputRange
                    minValue={4}
                    maxValue={12}
                    step={0.01}
                    name="term"
                    value={this.state.interestRate}
                    onChange={value => {
                      this.setState({ interestRate: value })
                    }}
                    className="block bg-yellow-dark font-semibold mb-6 p-3 rounded-md text-grey-darker w-full"
                  />
                </div>
                <div className="w-1/3 ml-8">
                  <div className="flex items-stretch relative w-full">
                    <div className="-mr-px flex" />
                    <input
                      className="appearance-none block bg-yellow-dark font-semibold p-3 rounded-md text-grey-darker w-full"
                      id="term"
                      type="number"
                      min="4"
                      max="12"
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

              <div className="mb-4 flex items-center">
                <div className="w-2/3">
                  <label
                    className="block mb-4 text-grey-dark font-bold text-md"
                    htmlFor="percentageDown"
                  >
                    Estimated home loan monthly payment
                  </label>
                </div>
                <div className="1/3 text-right ml-auto">
                  <div className="text-yellow-dark text-2xl font-semibold">
                    <span className="text-lg font-regular">$</span>
                    {presentValue
                      .toFixed(2)
                      .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center">
                <div className="w-1/3 flex">
                  <label
                    className="block font-bold text-grey-darker mb-2 text-xs uppercase pr-8 text-right w-100"
                    htmlFor="percentageDown"
                  >
                    Percentage Down
                  </label>
                </div>
                <div className="w-1/3">
                  <InputRange
                    minValue={0}
                    maxValue={100}
                    step={0.01}
                    name="term"
                    value={this.state.percentageDown}
                    onChange={value => {
                      this.setState({ percentageDown: value })
                    }}
                    className="block bg-yellow-dark font-semibold mb-6 p-3 rounded-md text-grey-darker w-full"
                  />
                </div>
                <div className="w-1/3 ml-8">
                  <div className="flex items-stretch relative w-full">
                    <div className="-mr-px flex" />
                    <input
                      className="appearance-none block bg-yellow-dark font-semibold p-3 rounded-md text-grey-darker w-full"
                      id="term"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      name="percentageDown"
                      value={this.state.percentageDown}
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
              <div className="mb-4 flex items-center">
                <div className="w-2/3">
                  <label
                    className="block font-bold text-grey-darker mb-2 text-sm uppercase pr-8 text-right"
                    htmlFor="percentageDown"
                  >
                    Home Value for purchase
                  </label>
                </div>
                <div className="1/3 text-right ml-auto">
                  <div className="text-yellow-dark text-2xl font-semibold">
                    <div className="text-yellow-dark text-2xl font-semibold">
                      <div className="rounded-full border-solid border-2 border-yellow-dark bg-grey-darkest h-24  flex items-center justify-center">
                        <div className="mx-2">
                          <span className="text-lg font-regular">$</span>
                          {valueForPurchase
                            .toFixed(2)
                            .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default RentVsBuy
