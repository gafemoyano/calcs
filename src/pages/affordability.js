import React, { Component } from "react";
import Link from "gatsby-link";
import CurrencyInput from "react-currency-input";
import InputRange from "react-input-range";
import InputGroup from "../components/InputGroup";
import "./input-range.css";
import { VictoryPie, VictoryLabel } from "victory";
import { formatNumber, formatPercentage } from "../utils/utils";

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

      return formatNumber(result);
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
    let monthlyTaxesPercent = formatPercentage(
      (monthlyTaxes / totalMonthlyPayment) * 100
    );
    let monthlyInsurancePercent = formatPercentage(
      (monthlyInsurance / totalMonthlyPayment) * 100
    );
    let montlhyPMIPercent = formatPercentage(
      (monthlyPMI / totalMonthlyPayment) * 100
    );
    let monthlyLoanPaymentPercent = formatPercentage(
      (monthlyLoanPayment / totalMonthlyPayment) * 100
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
                    className="block bg-yellow-dark font-semibold mb-6 p-3 rounded-md text-grey-darker w-full"
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
                      className="relative appearance-none bg-yellow-dark font-semibold p-3 rounded-md text-grey-darker w-full pl-4"
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
                    className="block bg-yellow-dark font-semibold mb-6 p-3 rounded-md text-grey-darker w-full"
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
                      className="relative appearance-none bg-yellow-dark font-semibold p-3 rounded-md text-grey-darker w-full pl-4"
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
                      className="block appearance-none w-full bg-yellow-dark font-semibold border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded leading-tight"
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
                    <select className="block appearance-none w-full bg-yellow-dark font-semibold border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded leading-tight">
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
                    maxValue={12}
                    step={0.01}
                    name="term"
                    value={this.state.interestRate}
                    onChange={value => {
                      this.setState({ interestRate: value });
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
                      max="12"
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
                    className="block bg-yellow-dark font-semibold mb-6 p-3 rounded-md text-grey-darker w-full"
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
                      className="relative appearance-none bg-yellow-dark font-semibold p-3 rounded-md text-grey-darker w-full pl-4"
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
                    className="block bg-yellow-dark font-semibold mb-6 p-3 rounded-md text-grey-darker w-full"
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
                      className="relative appearance-none bg-yellow-dark font-semibold p-3 rounded-md text-grey-darker w-full pl-4"
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
            <div className="max-w-md ml-24" style={{ marginTop: "-4rem" }}>
              <div style={{ width: "300px" }}>
                <svg viewBox="0 0 300 300">
                  <VictoryPie
                    standalone={false}
                    colorScale={["#22292f", "#b8c2cc", "#fff382", "#fdb714"]}
                    width={300}
                    height={300}
                    data={[
                      { x: "", y: monthlyTaxes },
                      { x: "", y: monthlyInsurance },
                      { x: "", y: monthlyPMI },
                      { x: "", y: monthlyLoanPayment }
                    ]}
                    innerRadius={68}
                    labelRadius={100}
                    style={{ labels: { fontSize: 20, fill: "white" } }}
                  />
                  <VictoryLabel
                    textAnchor="middle"
                    style={{ fontSize: 18, fontWeight: 400, fill: "#fdb714" }}
                    x={150}
                    y={125}
                    text={"Total"}
                  />{" "}
                  <VictoryLabel
                    textAnchor="middle"
                    style={{ fontSize: 18, fontWeight: 400, fill: "#fdb714" }}
                    x={150}
                    y={140}
                    text={"Monthly Payment"}
                  />
                  <VictoryLabel
                    textAnchor="middle"
                    style={{ fontSize: 28, fontWeight: 500, fill: "#fdb714" }}
                    x={150}
                    y={160}
                    text={formatNumber(totalMonthlyPayment)}
                  />
                </svg>
              </div>
              <div className="block -my-8">
                <div className="flex justify-start mb-4">
                  <div className="items-center">
                    <div
                      className="rounded-full p-4 mr-3"
                      style={{ backgroundColor: "#22292f" }}
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-grey-darker text-xl">
                      Monthly Taxes
                    </div>
                    <div className="text-yellow-dark-darkest text-xl font-semibold">
                      {formatNumber(monthlyTaxes)}
                      <span className="text-grey-dark ml-2 font-light">
                        {monthlyTaxesPercent}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-start mb-4">
                  <div className="items-center">
                    <div
                      className="rounded-full p-4 mr-3"
                      style={{ backgroundColor: "#b8c2cc" }}
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-grey-darker text-xl">
                      Monthly Insurance
                    </div>
                    <div className="text-grey-darkest text-xl font-semibold">
                      {formatNumber(monthlyInsurance)}
                      <span className="text-grey-dark ml-2 font-light">
                        {monthlyInsurancePercent}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-start mb-4">
                  <div className="items-center">
                    <div
                      className="rounded-full p-4 mr-3"
                      style={{ backgroundColor: "#fff382" }}
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-grey-darker text-xl">Monthly PMI</div>
                    <div className="text-yellow-dark-darkest text-xl font-semibold">
                      {formatNumber(monthlyPMI)}
                      <span className="text-grey-dark ml-2 font-light">
                        {montlhyPMIPercent}
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
                      Monthly Loan Payment
                    </div>
                    <div className="text-yellow-dark-darkest text-xl font-semibold">
                      {formatNumber(monthlyLoanPayment)}
                      <span className="text-grey-dark ml-2 font-light">
                        {monthlyLoanPaymentPercent}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-start mb-4">
                  <div className="items-center">
                    <div className="mr-3 font-bold text-2xl text-center w-8">
                      -
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-grey-darker text-xl">
                      Amount Available to Borrow
                    </div>
                    <div className="text-yellow-dark-darkest text-xl font-semibold">
                      {formatNumber(borrowAmount)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-start mb-4">
                  <div className="items-center">
                    <div className="mr-3 font-bold text-2xl text-center w-8">
                      -
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-grey-darker text-xl">
                      Money needed for the down payment
                    </div>
                    <div className="text-yellow-dark-darkest text-xl font-semibold">
                      {downPayment}
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
