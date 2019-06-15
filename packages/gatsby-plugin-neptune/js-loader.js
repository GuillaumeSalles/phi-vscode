module.exports = function gatsbyJsLoader(source) {
  console.log("Inside gatsby-js-loader");
  console.log(source);

  return `
import React from "react"
import styles from "style-loader!css-loader?modules=true!gatsby-plugin-neptune/css-loader?modules!./NewProject.neptune"

const MyComponent = () => <div className={styles.container}>HEY</div>

export default MyComponent
`;
};
