const components = ["Square", "SquaresColumn", "NineSquares"];

describe("Gatsby", function () {
  function testComponent(componentName) {
    it(componentName, function () {
      cy.visit(`http://localhost:8000/test?component=${componentName}`);
      cy.get("#__testing_root__");
      cy.matchImageSnapshot();
    });
  }

  for (let component of components) {
    testComponent(component);
  }
});

describe("Next", function () {
  function testComponent(componentName) {
    it(componentName, function () {
      cy.visit(`http://localhost:8001/test?component=${componentName}`);
      cy.get("#__testing_root__");
      cy.matchImageSnapshot();
    });
  }

  for (let component of components) {
    testComponent(component);
  }
});
