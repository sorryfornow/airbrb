import React from 'react'
import Login from './Login'
import { MemoryRouter } from 'react-router-dom'

describe('<Login />', () => {
  it('renders', () => {
    const wrapped = <MemoryRouter>{<Login />}</MemoryRouter>
    cy.mount(wrapped)
  })

  it('contains email and password fields', () => {
    const wrapped = <MemoryRouter>{<Login />}</MemoryRouter>
    cy.mount(wrapped)
    cy.get('#login-email').should('exist');
    cy.get('#login-password').should('exist');
  })

  it('contains login button', () => {
    const wrapped = <MemoryRouter>{<Login />}</MemoryRouter>
    cy.mount(wrapped)
    cy.get('[data-cy=login-button]').should('exist');
  })
})
