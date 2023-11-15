import React from 'react'
import DateSelector from './DateSelector'

let testData;

describe('<DateSelector />', () => {
  before(function () {
    cy.fixture('example').then(function (testdata) {
      console.log('test data cy: ', testdata)
      testData = testdata
    })
  })

  it('renders', () => {
    cy.mount(<DateSelector id={0} dates={testData.dates1} setDates={cy.stub().as('setDates')}/>)
  })

  it('setDates function called when date is selected', () => {
    cy.mount(<DateSelector id={0} dates={testData.dates1} setDates={cy.stub().as('setDates')}/>)
    cy.get(':nth-child(1) > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root').click()
    cy.get('[data-timestamp="1698757200000"]').click()
    cy.get('@setDates').should('have.been.called')
  })
})
