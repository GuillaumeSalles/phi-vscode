/** @jsx jsx */
import { jsx } from "@emotion/core";
import { fontSizes, fontFamilies } from "../state";
import { column, mainPadding, heading } from "../styles";

function Typographies() {
  return (
    <div css={[column, mainPadding]}>
      <h1 css={heading}>Typography</h1>
      <h2>Font family</h2>
      {Array.from(fontFamilies.entries()).map(entry => (
        <div key={entry[0]}>
          {entry[1].name} - {entry[1].value}
        </div>
      ))}
      <h2>Font sizes</h2>
      {Array.from(fontSizes.entries()).map(entry => (
        <div
          key={entry[0]}
          css={{
            fontSize: entry[1].value,
            lineHeight: 1.5
          }}
        >
          {entry[1].name} - {entry[1].value}
        </div>
      ))}
    </div>
  );
}

export default Typographies;
