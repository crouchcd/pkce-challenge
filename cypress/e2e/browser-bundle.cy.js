describe('PKCE Browser Bundle Tests', () => {
  beforeEach(() => {
    cy.visit('/browser-test/index.html')
  })

  it('should load the page successfully', () => {
    cy.get('#pkceChallenge').should('exist')
    cy.get('#verifyChallenge').should('exist')
    cy.get('#generateChallenge').should('exist')
  })

  it('should generate a valid PKCE challenge', () => {
    // Wait for the async operations to complete and populate the DOM
    cy.get('#pkceChallenge', { timeout: 10000 }).should('not.be.empty')
    
    // Verify the PKCE challenge object is displayed
    cy.get('#pkceChallenge').invoke('text').then((text) => {
      const pkceData = JSON.parse(text)
      
      // Verify the object has the required properties
      expect(pkceData).to.have.property('code_verifier')
      expect(pkceData).to.have.property('code_challenge')
      
      // Verify the code_verifier is a string with proper length (43-128 chars)
      expect(pkceData.code_verifier).to.be.a('string')
      expect(pkceData.code_verifier.length).to.be.at.least(43)
      expect(pkceData.code_verifier.length).to.be.at.most(128)
      
      // Verify the code_challenge is a string
      expect(pkceData.code_challenge).to.be.a('string')
      expect(pkceData.code_challenge.length).to.be.greaterThan(0)
    })
  })

  it('should verify the challenge successfully', () => {
    // Wait for verification result
    cy.get('#verifyChallenge', { timeout: 10000 }).should('not.be.empty')
    
    // Verify that the challenge verification returned true
    cy.get('#verifyChallenge').invoke('text').then((text) => {
      expect(text).to.equal('true')
    })
  })

  it('should generate the same challenge from the verifier', () => {
    // Wait for the challenge generation test
    cy.get('#generateChallenge', { timeout: 10000 }).should('not.be.empty')
    
    // Verify that the generated challenge matches (should end with "true")
    cy.get('#generateChallenge').invoke('text').then((text) => {
      // The format should be: "<challenge>, true"
      expect(text).to.match(/^[A-Za-z0-9_-]+, true$/)
    })
  })
})
