import React from 'react'
import DateSelector from './DateSelector'

describe('<DateSelector />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<DateSelector />)
  })
})