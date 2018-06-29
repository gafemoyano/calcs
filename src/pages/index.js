import React, { Component } from 'react'
import Link from 'gatsby-link'
import './input-range.css'

class IndexPage extends Component {
  render() {
    return (
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <ul>
          <li>
            <Link to="/monthly-mortgage" className="text-xl text-grey mb-8">
              Monthly Mortgage Calculator
            </Link>
          </li>
          <li>
            <Link to="/affordability" className="text-xl text-grey mb-8">
              Affordability Calculator
            </Link>
          </li>
          <li>
            <Link to="/rentvsbuy" className="text-xl text-grey mb-8">
              Rent vs Buy Calculator
            </Link>
          </li>
        </ul>
      </div>
    )
  }
}

export default IndexPage
