import React, { Component } from "react";
import Link from "gatsby-link";
import CurrencyInput from "react-currency-input";
import InputRange from "react-input-range";
import InputGroup from "../components/InputGroup";
import "./input-range.css";
import { VictoryPie, VictoryLabel } from "victory";

const NOT_QUALIFIED = "NOT_QUALIFIED";
const QUALIFIED = "QUALIFIED";
const creditScoreRange = {
  5: {
    760: 0.000458,
    740: 0.000625,
    720: 0.000792,
    700: 0.000958,
    680: 0.001167,
    660: 0.001583
  },
  10: {
    760: 0.000342,
    740: 0.000492,
    720: 0.000608,
    700: 0.000725,
    680: 0.0009,
    660: 0.001183,
    640: 0.00125,
    620: 0.001342
  },
  15: {
    760: 0.000158,
    740: 0.000167,
    720: 0.000192,
    700: 0.000225,
    680: 0.000267,
    660: 0.000342,
    640: 0.000358,
    620: 0.000375
  }
};

class Affordability extends Component {
  state = {
    annualIncome: 100000,
    monthlyDebt: 1000,
    downPaymentPercent: 10,
    creditScore: 700,
    interestRate: 4.5,
    propertyTaxes: 5000,
    propertyInsurance: 3000
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  tryParseInt(str, defaultValue) {
    var retValue = defaultValue;
    if (str !== null) {
      if (str.length > 0) {
        if (!isNaN(str)) {
          retValue = parseInt(str);
        }
      }
    }
    return retValue;
  }

  presentValue = () => {
    let monthlyRate = this.monthlyRate();
    let pmt = this.monthlyLoanPayment();
    let presentValue =
      pmt *
      Math.pow(1 + monthlyRate, -360) *
      ((Math.pow(1 + monthlyRate, 360) - 1) / monthlyRate);
    return presentValue;
  };

  monthlyRate() {
    let interestRate = parseFloat(this.state.interestRate);
    return interestRate / 100 / parseFloat(12);
  }

  formatNumber(number) {
    if (isNaN(number)) {
      return number;
    } else {
      return `$ ${number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")}`;
    }
  }
  borrowAmount = () => {
    if (!this.isQualified()) {
      return "Not qualified.";
    } else {
      let presentValue = this.presentValue();
      if (presentValue < 0) {
        return "Not qualified.";
      } else {
        return presentValue;
      }
    }
    return 0;
  };

  downPayment() {
    if (!this.isQualified()) {
      return "";
    } else {
      let { downPaymentPercent } = this.state;
      let borrowAmount = this.borrowAmount();
      let result = (downPaymentPercent / 100) * borrowAmount;

      return this.formatNumber(result);
    }
  }
  monthlyTaxes() {
    return this.state.propertyTaxes / 12;
  }
  monthlyInsurance() {
    return this.state.propertyInsurance / 12;
  }
  monthlyPMI = borrowAmount => {
    if (this.isQualified()) {
      return borrowAmount * this.lookup();
    } else {
      return 0;
    }
  };

  totalMonthlyPayment(
    monthlyTaxes,
    monthlyInsurance,
    monthlyPMI,
    monthlyLoanPayment
  ) {
    if (this.isQualified()) {
      return monthlyTaxes + monthlyInsurance + monthlyPMI + monthlyLoanPayment;
    } else {
      return 0;
    }
  }
  isQualified = () => {
    let { downPaymentPercent } = this.state;
    let creditScore = parseInt(this.state.creditScore, 10);

    if (downPaymentPercent >= 20) {
      return false;
    } else if (
      (downPaymentPercent === 5 && creditScore === 640) ||
      (downPaymentPercent === 5 && creditScore === 620)
    ) {
      return false;
    } else {
      return true;
    }
  };

  monthlyLoanPayment = () => {
    let monthlyIncome = this.state.annualIncome / 12;
    let monthlyDebtPercent = this.state.monthlyDebt / monthlyIncome;

    let monthlyTaxes = this.monthlyTaxes();
    let monthlyTaxesPercent = monthlyTaxes / monthlyIncome;

    let monthlyInsurance = this.monthlyInsurance();
    let monthlyInsurancePercent = monthlyInsurance / monthlyIncome;

    let montlhyPMIPercent = "Not Qualified";
    if (this.isQualified()) {
      montlhyPMIPercent = this.state.monthlyPMI / monthlyIncome;
    }

    let result =
      (0.43 -
        monthlyDebtPercent -
        monthlyInsurancePercent -
        monthlyTaxesPercent) *
      monthlyIncome;
    return result;
  };

  lookup = () => {
    if (this.isQualified()) {
      let { creditScore, downPaymentPercent } = this.state;
      return creditScoreRange[downPaymentPercent][creditScore];
    }
    return 0;
  };
  render() {
    let {
      annualIncome,
      monthlyDebt,
      downPaymentPercent,
      creditScore,
      interestRate,
      propertyTaxes,
      propertyInsurance
    } = this.state;

    let borrowAmount = this.borrowAmount();
    let downPayment = this.downPayment();
    let monthlyTaxes = this.monthlyTaxes();
    let monthlyInsurance = this.monthlyInsurance();
    let monthlyPMI = this.monthlyPMI(borrowAmount);
    let monthlyLoanPayment = this.monthlyLoanPayment();
    let totalMonthlyPayment = this.totalMonthlyPayment(
      monthlyTaxes,
      monthlyInsurance,
      monthlyPMI,
      monthlyLoanPayment
    );
    return (
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-xl text-grey mb-8">
          Decide Between Buying a Home or Renting
        </h1>

        <div className="block md:flex flex-row -mx-4">
          <div className="w-100 md:w-1/2 px-4">
            <form>
              <div className="mb-4 flex items-center">
                <div className="w-1/3">
                  <label
                    className="block font-bold text-grey-darker mb-2 text-xs uppercase pr-8 text-right"
                    htmlFor="annualIncome"
                  >
                    What's your annual income?
                  </label>
                </div>
                <div className="w-1/3">
                  <InputRange
                    minValue={0}
                    maxValue={2000000}
                    name="annualIncome"
                    value={annualIncome}
                    onChange={value => {
                      this.setState({ annualIncome: value });
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
                      name="monthlyRent"
                      value={annualIncome}
                      onChangeEvent={this.handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center">
                <div className="w-1/3">
                  <label
                    className="block font-bold text-grey-darker mb-2 text-xs uppercase pr-8 text-right"
                    htmlFor="annualIncome"
                  >
                    How much monthly debt do you have?
                  </label>
                </div>
                <div className="w-1/3">
                  <InputRange
                    minValue={0}
                    maxValue={200000}
                    name="monthlyDebt"
                    value={monthlyDebt}
                    onChange={value => {
                      this.setState({ monthlyDebt: value });
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
                      name="monthlyDebt"
                      value={monthlyDebt}
                      onChangeEvent={this.handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center">
                <div className="w-1/3">
                  <label
                    className="block font-bold text-grey-darker mb-2 text-xs uppercase pr-8 text-right"
                    htmlFor="annualIncome"
                  >
                    How much do you want to put as a down payment?
                  </label>
                </div>
                <div className="w-2/3">
                  <div className="relative">
                    <select
                      className="block appearance-none w-full bg-yellow-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded leading-tight"
                      name="downPaymentPercent"
                      value={this.state.downPaymentPercent}
                      onChange={this.handleChange}
                    >
                      <option value="5">5 %</option>
                      <option value="10">10 %</option>
                      <option value="15">15 %</option>
                      <option value="20">20% or more</option>
                    </select>
                    <div className="pointer-events-none absolute pin-y pin-r flex items-center px-2 text-grey-darker">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center">
                <div className="w-1/3">
                  <label
                    className="block font-bold text-grey-darker mb-2 text-xs uppercase pr-8 text-right"
                    htmlFor="annualIncome"
                  >
                    What's your credit score?
                  </label>
                </div>
                <div className="w-2/3">
                  <div className="relative">
                    <select className="block appearance-none w-full bg-yellow-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded leading-tight">
                      <option value="760">760 or more</option>
                      <option value="740">740 - 759</option>
                      <option value="720">720 - 739</option>
                      <option value="700">700 - 719</option>
                      <option value="680">680 - 699</option>
                      <option value="660">660 - 679</option>
                      <option value="640">640 - 659</option>
                      <option value="620">620 - 639</option>
                    </select>
                    <div className="pointer-events-none absolute pin-y pin-r flex items-center px-2 text-grey-darker">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
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
                    minValue={0}
                    maxValue={100}
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
                      min="0"
                      max="100"
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

              <div className="mb-4 flex items-center">
                <div className="w-1/3">
                  <label
                    className="block font-bold text-grey-darker mb-2 text-xs uppercase pr-8 text-right"
                    htmlFor="annualIncome"
                  >
                    Property Taxes
                  </label>
                </div>
                <div className="w-1/3">
                  <InputRange
                    minValue={0}
                    maxValue={200000}
                    name="propertyTaxes"
                    value={propertyTaxes}
                    onChange={value => {
                      this.setState({ propertyTaxes: value });
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
                      name="propertyTaxes"
                      value={propertyTaxes}
                      onChangeEvent={this.handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-4 flex items-center">
                <div className="w-1/3">
                  <label
                    className="block font-bold text-grey-darker mb-2 text-xs uppercase pr-8 text-right"
                    htmlFor="annualIncome"
                  >
                    Property Insurance
                  </label>
                </div>
                <div className="w-1/3">
                  <InputRange
                    minValue={0}
                    maxValue={200000}
                    name="propertyInsurance"
                    value={propertyInsurance}
                    onChange={value => {
                      this.setState({ propertyInsurance: value });
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
                      name="propertyInsurance"
                      value={propertyInsurance}
                      onChangeEvent={this.handleChange}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="w-100 md:w-1/2 px-4">
            <div className="mb-4 flex items-center">
              <div className="w-2/3">
                <label
                  className="block font-bold text-grey-darker mb-2 text-sm uppercase pr-8 text-right"
                  htmlFor="percentageDown"
                >
                  Amount Available to Borrow
                </label>
              </div>
              <div className="1/3 text-right ml-auto">
                <div className="text-yellow-dark text-2xl font-semibold">
                  {this.formatNumber(borrowAmount)}
                </div>
              </div>
            </div>

            <div className="mb-4 flex items-center">
              <div className="w-2/3">
                <label
                  className="block font-bold text-grey-darker mb-2 text-sm uppercase pr-8 text-right"
                  htmlFor="percentageDown"
                >
                  Money needed for the down payment
                </label>
              </div>
              <div className="1/3 text-right ml-auto">
                <div className="text-yellow-dark text-2xl font-semibold">
                  {downPayment}
                </div>
              </div>
            </div>

            <div className="mb-4 flex items-center">
              <div className="w-2/3">
                <label
                  className="block font-bold text-grey-darker mb-2 text-sm uppercase pr-8 text-right"
                  htmlFor="monthlyTaxes"
                >
                  Monthly Taxes
                </label>
              </div>
              <div className="1/3 text-right ml-auto">
                <div className="text-yellow-dark text-2xl font-semibold">
                  {this.formatNumber(monthlyTaxes)}
                </div>
              </div>
            </div>
            <div className="mb-4 flex items-center">
              <div className="w-2/3">
                <label
                  className="block font-bold text-grey-darker mb-2 text-sm uppercase pr-8 text-right"
                  htmlFor="monthlyInsurance"
                >
                  Monthly Insurance
                </label>
              </div>
              <div className="1/3 text-right ml-auto">
                <div className="text-yellow-dark text-2xl font-semibold">
                  {this.formatNumber(monthlyInsurance)}
                </div>
              </div>
            </div>
            <div className="mb-4 flex items-center">
              <div className="w-2/3">
                <label
                  className="block font-bold text-grey-darker mb-2 text-sm uppercase pr-8 text-right"
                  htmlFor="monthlyPMI"
                >
                  Monthly PMI
                </label>
              </div>
              <div className="1/3 text-right ml-auto">
                <div className="text-yellow-dark text-2xl font-semibold">
                  {this.formatNumber(monthlyPMI)}
                </div>
              </div>
            </div>

            <div className="mb-4 flex items-center">
              <div className="w-2/3">
                <label
                  className="block font-bold text-grey-darker mb-2 text-sm uppercase pr-8 text-right"
                  htmlFor="monthlyPMI"
                >
                  Monthly Loan Payment
                </label>
              </div>
              <div className="1/3 text-right ml-auto">
                <div className="text-yellow-dark text-2xl font-semibold">
                  {this.formatNumber(monthlyLoanPayment)}
                </div>
              </div>
            </div>

            <div className="mb-4 flex items-center">
              <div className="w-2/3">
                <label
                  className="block font-bold text-grey-darker mb-2 text-sm uppercase pr-8 text-right"
                  htmlFor="totalMonthlyPayment"
                >
                  Total Monthly Payment
                </label>
              </div>
              <div className="1/3 text-right ml-auto">
                <div className="text-yellow-dark text-2xl font-semibold">
                  <div className="rounded-full border-solid border-2 border-yellow bg-grey-darkest h-24  flex items-center justify-center">
                    <div className="mx-2">
                      {this.formatNumber(totalMonthlyPayment)}
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

export default Affordability;
