import React from 'react'
import Login from './Login'
import {
  MemoryRouter } from 'react-router-dom'

describe('<Login />', () => {
  it('renders', () => {
    const wrapped = <MemoryRouter>{<Login />}</MemoryRouter>
    cy.mount(wrapped)
  })
})