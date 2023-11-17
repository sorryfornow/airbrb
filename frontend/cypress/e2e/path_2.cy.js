describe('template spec', () => {
  it('a user logs, creates, edits, publishes, deletes a listing and then logs out ', () => {
    // login
    cy.visit('http://localhost:3000/login')
    cy.get('#login-email').type('test2@hotmail.com')
    cy.get('#login-password').type('asdf')
    cy.get('.MuiButtonBase-root').click()
    cy.get('[href="/mylistings"]').click()
    // create
    cy.get('[data-cy=create-new-listing-button]').click()
    cy.get('#title').type('cy test property 1')
    cy.get('#street').type('2 New St')
    cy.get('#city').type('Newtown')
    cy.get('#state').type('NSW')
    cy.get('#postcode').type('2222')
    cy.get('#country').type('Australia')
    cy.get('#price').type(100)
    cy.get('#demo-simple-select').click()
    cy.get('[data-cy=property-type-house]').click()
    cy.get('#number-of-bathrooms').type(2)
    cy.get('[data-cy=create-listing-thumbnail-input]').selectFile('./cypress/e2e/house_icon_1.png');
    cy.get('[data-cy=create-listing-checkbox-kitchen]').click()
    cy.get('[data-cy=create-listing-bedroom-add]').click()
    cy.get('[data-cy=bedroom-input-0]').type(2)
    cy.get('[data-cy=create-listing-button-create]').click()
    // publish
    cy.get('[data-cy=publish-listing-button]').last().click()
    cy.get('#mui-11').type('01122023')
    cy.get('#mui-13').type('10122023')
    cy.get('[data-cy="publish-listing-save-button"]').click()
    // edit
    cy.get('[data-cy=edit-listing-button]').last().click()
    cy.get('#street').clear()
    cy.get('#street').type('3 New Street')
    cy.get('[data-cy=edit-listing-save-btn]').click()
    // delete
    cy.get('[data-cy=edit-listing-button]').last().click()
    cy.get('[data-cy=delete-listing-btn]').last().click()
    // // logout
    cy.get('[data-cy="logout-button"]').click()
  })
})
