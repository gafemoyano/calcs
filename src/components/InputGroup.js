import React, { Component } from 'react'

const InputGroup = props => {
  const { children, text, ...rest } = this.props
  return (
    <div className="flex items-stretch relative w-full">
      <div className="-mr-px flex">
        <div
          className="align-items-center flex leading-normal text-center whitespace-no-wrap bg-grey-light rounded-sm"
          style={{ padding: '.375rem .75rem' }}
        >
          {text}
        </div>
      </div>
      {children}
    </div>
  )
}
export default InputGroup
