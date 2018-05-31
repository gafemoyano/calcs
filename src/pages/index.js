import React from "react";
import Link from "gatsby-link";

const IndexPage = () => (
  <form className="mx-auto md:w-1/2">
    <label
      className="block font-bold mb-2 text-xs uppercase"
      htmlFor="first-name"
    >
      What's the purchase price of the home?
    </label>
    <input
      className="appearance-none block bg-grey-lighter mb-6 p-3 rounded-md text-grey-darker w-full"
      id="first-name"
      type="text"
      placeholder="$3.000.000"
      type="text"
    />

    <label
      className="block font-bold mb-2 text-xs uppercase"
      htmlFor="last-name"
    >
      How much do you want to put down?
    </label>
    <input
      className="appearance-none block bg-grey-lighter mb-6 p-3 rounded-md text-grey-darker w-full"
      id="last-name"
      type="text"
      placeholder="$30.000"
    />
    <p
      className="block font-bold mb-2 text-xs uppercase"
    >
      Are you a veteran or currently serving in the military?
    </p>
    <div className="block mb-6">
      <div className="inline mr-2">
        <input
          id="yes"
          type="radio"
          value={true}
          className="mr-1"
        />
        <label
          className="font-bold mb-2 text-xs uppercase"
          htmlFor="yes">Yes</label>
      </div>
      <div className="inline ml-2">
        <input
          id="yes"
          type="radio"
          value={true}
          className="mr-1"
        />
        <label
          className="font-bold mb-2 text-xs uppercase"
          htmlFor="no">No</label>
      </div>
    </div>

    <label
      className="block font-bold mb-2 text-xs uppercase"
      htmlFor="zip-code"
    >
      What is your hom's ZIP code?
    </label>
    <input
      className="appearance-none block bg-grey-lighter mb-6 p-3 rounded-md text-grey-darker w-full"
      id="zip-code"
      type="text"
      placeholder="10001"
    />
    <label className="block font-bold mb-2 text-xs uppercase" htmlFor="credit">
      How would you rate your credit?
    </label>
    <div className="block relative w-full">
      <select className="mb-6 block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded" id="grid-state">
        <option>Excellent</option>
        <option>Average</option>
        <option>Poor</option>
      </select>
      <div className="pointer-events-none absolute pin-y pin-r flex items-center px-2 text-grey-darker">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
      </div></div>
    <button className="border-b-4 border-grey-darker hover:border-grey-dark bg-grey-dark hover:bg-grey font-bold px-6 py-3 rounded text-sm text-white">
      Submit
    </button>
  </form>
);

export default IndexPage;
