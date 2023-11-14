import React from 'react'
import MyListingCard from './MyListingCard'
import { MemoryRouter } from 'react-router-dom'

let testData;

describe('<MyListingCard />', () => {
  before(function () {
    cy.fixture('example').then(function (testdata) {
      console.log('test data cy: ', testdata)
      testData = testdata
    })
  })

  it('renders thumbnail', () => {
    const wrapped = <MemoryRouter>{<MyListingCard data={testData.property1}/>}</MemoryRouter>
    cy.mount(wrapped)
    console.log('card-thumbnail: ', cy.get(`[data-cy=${'card-thumbnail'}]`)
    )
    cy.get(`[data-cy=${'card-thumbnail'}]`).should('be.visible')
  })

  it('renders title, address, price, number of beds, amenities, rating and number of reviews', () => {
    const wrapped = <MemoryRouter>{<MyListingCard data={testData.property1}/>}</MemoryRouter>
    cy.mount(wrapped)

    cy.contains('Address: 2 New St, Newtown, NSW2222 Australia')
    cy.contains('Property Type: house')
    cy.contains('Price: 100')
    cy.contains('Number of beds: 2')
    cy.contains('Amenities:')
    cy.contains('- Kitchen')
    cy.contains('Rating:')
    cy.contains('Number of reviews: 0')
  })

  it('renders buttons correctly', () => {
    const wrapped = <MemoryRouter>{<MyListingCard data={testData.property1}/>}</MemoryRouter>
    cy.mount(wrapped)

    cy.get('button').first().should('contains.text', 'Edit')
    cy.get('button').last().should('contains.text', 'Publish')
  })
})
