import Variables from "../support/variables";
import Methods from "../support/methods";

describe('template spec', () => {
    const baseUrl = 'https://www.saucedemo.com/';
    const variable = new Variables();
    const method = new Methods();
    let items = ["Sauce Labs Backpack", "Sauce Labs Onesie", "Sauce Labs Fleece Jacket"]

    beforeEach(() => {
        cy.visit(baseUrl)
    })

    it('check login page', () => {
        cy.url().should('eq', baseUrl)
        cy.title().should('eq', 'Swag Labs')
    })

    it('valid user log in', () => {
        let user;
        let password;

        cy.get('#login_credentials').then((data) => {
            let allText = data.text()
            let index = allText.indexOf(":") + 1
            user = allText.substring(index, index + 13);
        })
        cy.get('.login_password').then((data) => {
            let allText = data.text()
            let index = allText.indexOf(":") + 1
            password = allText.substring(index, index + 12);
        })
        cy.get('body').then(() => {
            cy.get('[data-test="username"]').type(user);
            cy.get('[data-test="password"]').type(password)
            cy.get('[data-test="login-button"]').click();
        })
        cy.url().should('eq', 'https://www.saucedemo.com/inventory.html')

    })

    it('invalid user', () => {
        const errorText = 'Epic sadface: Username and password do not match any user in this service'
        method.loginUser(variable.invalidUser, variable.invalidPassword)
        cy.get('[data-test="error"]').should('exist')
            .and('have.text', errorText)
    })

    it('add items', () => {
        method.loginUser(variable.validUser, variable.validPassword)
        cy.addToCart(items)
        cy.get('.shopping_cart_badge').should('have.text', items.length);
        cy.get('#shopping_cart_container').click()
        cy.get('.cart_item').should('have.length', items.length)
    })

    it('user info', () => {
        method.loginUser(variable.validUser, variable.validPassword)
        cy.addToCart(items)
        cy.get('#shopping_cart_container').click()
        cy.get('.cart_item').find('.inventory_item_name')
            .map("innerText")
            .should('deep.equal', items)
        cy.get('[data-test="checkout"]').click()
        method.userInfo("Eddy", "Jones", "12345")
        cy.get('#continue').click()
        cy.get('.cart_item').find('.inventory_item_name')
            .map("innerText")
            .should('deep.equal', items)
    })

    it('6. pre-fill', () => {
        method.loginUser(variable.validUser, variable.validPassword)
        cy.addToCart(items)
        cy.get('#shopping_cart_container').click()
        cy.get('[data-test="checkout"]').click()
        method.checkPlaceholders()

    })

    it('making the checkout', ()=>{
        method.loginUser(variable.validUser, variable.validPassword)
        cy.addToCart(items)
        cy.get('#shopping_cart_container').click()
        cy.get('.cart_item').find('.inventory_item_name')
            .should('be.visible')
            .map("innerText")
            .should('deep.equal', items)
        cy.get('[data-test="checkout"]').click()
        method.userInfo("Eddy", "Jones", "12345")
        cy.get('#continue').click()
        cy.get('.summary_info_label').last()
            .should('be.visible')

    })

    it('8. checkout', ()=>{
        let itemTotal;
        let tax;
        method.loginUser(variable.validUser, variable.validPassword)
        cy.addToCart(items)
        cy.get('#shopping_cart_container').click()
        cy.get('.cart_item').find('.inventory_item_name')
            .map("innerText")
            .should('deep.equal', items)
        cy.get('[data-test="checkout"]').click()
        method.userInfo("Eddy", "Jones", "12345")
        cy.get('#continue').click()
        cy.get('.summary_subtotal_label').then(sum =>{
            itemTotal = +sum.text().replaceAll(/[а-яА-Яa-zA-Z$:\s]/g, '')
            cy.get('.inventory_item_price')
                .map('innerText')
                .mapInvoke('replace', '$', '')
                .map(Number)
                .reduce((sum, num) => sum + num, 0)
                .should("equal", itemTotal)
        })
        cy.get('.summary_tax_label').then(data =>{
            tax = +data.text().replaceAll(/[а-яА-Яa-zA-Z$:\s]/g, '')
        })
        cy.get('.summary_info').then(() =>{
            cy.get('.summary_info_label').last()
                .should("contain.text", itemTotal + tax)
                .and('be.visible')

        })
    })

    it('9. complete checkout', ()=>{
        method.loginUser(variable.validUser, variable.validPassword)
        cy.addToCart(items)
        cy.get('#shopping_cart_container').click()
        cy.get('[data-test="checkout"]').click()
        method.userInfo("Eddy", "Jones", "12345")
        cy.get('#continue').click()
        cy.get('#finish').click()
        cy.get('.title').should('have.text', 'Checkout: Complete!').and('be.visible')
        cy.get('#checkout_complete_container').should('be.visible')
            .find('.complete-text')
            .should('have.text', 'Your order has been dispatched, and will arrive just as fast as the pony can get there!')

    })

    it('10. log out', ()=>{
        method.loginUser(variable.validUser, variable.validPassword)
        cy.addToCart(items)
        cy.get('#shopping_cart_container').click()
        cy.get('[data-test="checkout"]').click()
        method.userInfo("Eddy", "Jones", "12345")
        cy.get('#continue').click()
        cy.get('#finish').click()
        cy.getAllCookies().should('have.length', 1)
        cy.get('#react-burger-menu-btn').click()
        cy.get('#logout_sidebar_link').click()
        cy.getAllCookies().should('have.length', 0)

    })

})