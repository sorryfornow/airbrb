import React from 'react'
import SearchDropdown from './SearchDropdown'

describe('<SearchDropdown />', () => {
  it('renders', () => {
    const mockSetSearchFilter = cy.stub()
    cy.mount(<SearchDropdown searchFilter={'price'} setSearchFilter={mockSetSearchFilter}/>)
  })

  it('label and filter correctly', () => {
    const mockSetSearchFilter = cy.stub()
    cy.mount(<SearchDropdown searchFilter={'price'} setSearchFilter={mockSetSearchFilter}/>)
    cy.contains('Search By')
    cy.contains('Price Range')
  })
})
