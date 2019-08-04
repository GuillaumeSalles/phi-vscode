/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import Layer from "./Layer";
import { column } from "../../styles";

type Props = {
  component: T.Component;
  refs: T.Refs;
};

function Component({ component, refs }: Props) {
  return (
    <div css={column}>
      {Array.from(refs.breakpoints.entries()).map(entry => (
        <div key={entry[0]} css={[column, { margin: "12px 0" }]}>
          <h3
            css={{
              color: "rgb(153, 153, 153)",
              fontSize: "12px",
              margin: "0 0 4px 0",
              fontWeight: 400
            }}
          >
            {entry[1].name} - {entry[1].value.value}px
          </h3>
          <div
            css={[
              {
                border: "none",
                background: "white",
                width: entry[1].value.value + "px"
              }
            ]}
          >
            {component.layout && (
              <Layer
                layer={component.layout}
                refs={refs}
                width={entry[1].value.value}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Component;
