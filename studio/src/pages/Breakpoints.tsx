/** @jsx jsx */
import { jsx } from "@emotion/core";
import { column, mainPadding, heading } from "../styles";

const defaultBreakpoints = [
  ["small", 544],
  ["medium", 768],
  ["large", 1012],
  ["xlarge", 1280]
].map(x => ({ name: x[0], width: x[1] }));

function Breakpoints() {
  return (
    <div css={[column, mainPadding]}>
      <h1 css={heading}>Breakpoints</h1>
      <div
        css={{ display: "flex", flexDirection: "column", overflowX: "auto" }}
      >
        {defaultBreakpoints.map(b => (
          <div
            key={b.name}
            css={{
              width: b.width,
              background: "gray",
              height: "24px",
              marginTop: "8px",
              marginBottom: "2px",
              paddingLeft: "4px"
            }}
          >
            {b.name} - {b.width}px
          </div>
        ))}
      </div>
    </div>
  );
}

export default Breakpoints;
