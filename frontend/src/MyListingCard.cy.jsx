import React from 'react'
import MyListingCard from './MyListingCard'

describe('<MyListingCard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<MyListingCard />)
  })
})