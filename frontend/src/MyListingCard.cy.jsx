import React from 'react'
import MyListingCard from './MyListingCard'
import {
  MemoryRouter } from 'react-router-dom'
  
let testData;

describe('<MyListingCard />', () => {
  before(function () {
    cy.fixture('example').then(function (testdata) {
      console.log('test data cy: ', testdata)
       testData = testdata
    })
})
  it('renders', () => {
    const wrapped = <MemoryRouter>{<MyListingCard data={testData.property1}/>}</MemoryRouter>

    console.log('fixture', testData.property1)
    cy.mount(wrapped)
  })
})
