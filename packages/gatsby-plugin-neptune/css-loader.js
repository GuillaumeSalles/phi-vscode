module.exports = function cssLoader(source) {
  console.log("Inside neptune-css-loader");

  return `
  .container {
    background: blue;
  }
  `;
};
