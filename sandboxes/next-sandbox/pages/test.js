import React from "react";
import * as Sample from "./Sample.phi";

const Test = ({ component }) => (
  <div id="__testing_root__">
    {React.createElement(Sample[component], {}, [])}
    <style jsx global>{`
      html,
      body {
        padding: 0;
        margin: 0;
      }
    `}</style>
  </div>
);

Test.getInitialProps = ({ query: { component } }) => {
  return { component };
};

export default Test;
