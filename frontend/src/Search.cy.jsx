import React from 'react'
import Search from './Search'

describe('<Search />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Search setAllListings={cy.stub().as('setAllListings')} setReload={cy.stub().as('setReload')} />)
  })

  it('renders correct input fields', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Search setAllListings={cy.stub().as('setAllListings')} setReload={cy.stub().as('setReload')} />)
    cy.get('#demo-simple-select').should('exist')
    cy.get('[data-cy=search-value]').should('exist')
  })

  it('renders correct buttons', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Search setAllListings={cy.stub().as('setAllListings')} setReload={cy.stub().as('setReload')} />)
    cy.get('[data-cy=search-button]').should('exist')
    cy.get('[data-cy=remove-filter-button]').should('exist')
  })

  it('renders correct buttons', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Search setAllListings={cy.stub().as('setAllListings')} setReload={cy.stub().as('setReload')} />)
    cy.get('[data-cy=search-button]').click()
    cy.get('[data-cy=remove-filter-button]').click()
    cy.get('@setAllListings').should('have.been.called')
    cy.get('@setReload').should('have.been.called')
  })
})
