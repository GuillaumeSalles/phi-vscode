/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "./types";
import { row, column, mainPadding } from "./styles";
import Component from "./Component";

type Props = {
  components: T.Component[];
  refs: T.Refs;
};

function AllComponents({ components, refs }: Props) {
  return (
    <div css={[row, { height: "100%" }]}>
      <div css={[column, mainPadding, { flex: "1 1 auto" }]}>
        <h1>Components</h1>
        {components.map(component => (
          <div key={component.name} css={{ column }}>
            <h2>{component.name}</h2>
            <Component component={component} refs={refs} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllComponents;
