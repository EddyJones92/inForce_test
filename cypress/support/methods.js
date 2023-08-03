export default class Methods{

    loginUser(email, password){
        cy.get('[data-test="username"]').type(email);
        cy.get('[data-test="password"]').type(password)
        cy.get('[data-test="login-button"]').click();
    }

    userInfo(firstName, lastName, code){
        cy.get('#first-name').type(firstName)
        cy.get('#last-name').type(lastName)
        cy.get('#postal-code').type(code)
    }
    checkPlaceholders(firstName, lastName, code){
        cy.get('#first-name').should('have.attr', 'placeholder')
            .and('match', /First Name/)
        cy.get('#last-name').should('have.attr', 'placeholder')
            .and('match', /Last Name/)
        cy.get('#postal-code').should('have.attr', 'placeholder')
            .and('match', /Zip\/Postal Code/)
    }
}