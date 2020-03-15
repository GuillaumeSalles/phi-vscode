/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import Layer from "./Layer";
import { column, row } from "../../styles";

type Props = {
  component: T.Component;
  refs: T.Refs;
};

function Component({ component, refs }: Props) {
  return (
    <div css={column}>
      {Array.from(refs.artboards.entries()).map(entry => (
        <div key={entry[0]} css={[column, { margin: "12px 0" }]}>
          <div css={[row]}>
            {[{ id: "default", name: "Default", props: {} }]
              .concat(component.examples)
              .map(example => {
                return (
                  <div key={example.id} css={[column, { marginRight: "48px" }]}>
                    <h3
                      css={{
                        color: "rgb(153, 153, 153)",
                        fontSize: "12px",
                        margin: "0 0 4px 0",
                        fontWeight: 400
                      }}
                    >
                      {entry[1].name} - {entry[1].width}
                    </h3>
                    <div
                      css={[
                        {
                          border: "none",
                          background: entry[1].backgroundColor,
                          width: entry[1].width,
                          height: entry[1].height
                        }
                      ]}
                    >
                      {component.layout && (
                        <Layer
                          layer={component.layout}
                          refs={refs}
                          width={parseInt(entry[1].width.slice(0, -2))}
                          props={example.props}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Component;
