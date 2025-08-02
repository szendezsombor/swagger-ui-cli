describe('Serve Command', () => {
  afterEach(() => {
    cy.cliKill();
  });

  it('should create a web server on http://localhost:8000 by default', () => {
    cy.cli({
      command: 'serve',
      specFile: 'openapi.yaml',
    });
    cy.visit('http://localhost:8000/');
    cy.get('h2').contains('Swagger Petstore - OpenAPI 3.0');
  });

  it('should create a web server on http://localhost:8001 when --port=8001 flag provided', () => {
    cy.cli({
      command: 'serve',
      specFile: 'openapi.yaml',
      flags: ['--port=8001'],
    });
    cy.visit('http://localhost:8001/');
    cy.get('h2').contains('Swagger Petstore - OpenAPI 3.0');
  });
});
