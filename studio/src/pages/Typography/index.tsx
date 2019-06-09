/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import { fontSizes } from "../../state";
import { column, mainPadding, heading, subHeading, row } from "../../styles";
import SecondaryButton from "../../primitives/SecondaryButton";
import FontFamilies from "./FontFamilies";

type Props = {
  fontFamilies: T.FontFamiliesMap;
  onFontFamiliesChange: (fontFamilies: T.FontFamiliesMap) => void;
};

function Typography({ fontFamilies, onFontFamiliesChange }: Props) {
  return (
    <div css={[column, mainPadding]}>
      <h1 css={[heading, { marginBottom: "20px" }]}>Typography</h1>
      <FontFamilies
        fontFamilies={fontFamilies}
        onFontFamiliesChange={onFontFamiliesChange}
      />
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

export default Typography;
