/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import { column, mainPadding, heading } from "../../styles";
import FontFamilies from "./FontFamilies";
import FontSizes from "./FontSizes";

type Props = {
  fontFamilies: T.FontFamiliesMap;
  onFontFamiliesChange: (fontFamilies: T.FontFamiliesMap) => void;

  fontSizes: T.FontSizesMap;
  onFontSizesChange: (fontSizes: T.FontSizesMap) => void;
};

function Typography({
  fontFamilies,
  onFontFamiliesChange,
  fontSizes,
  onFontSizesChange
}: Props) {
  return (
    <div css={[column, mainPadding]}>
      <h1 css={[heading, { marginBottom: "20px" }]}>Typography</h1>
      <FontFamilies
        fontFamilies={fontFamilies}
        onFontFamiliesChange={onFontFamiliesChange}
      />
      <FontSizes items={fontSizes} onItemsChange={onFontSizesChange} />
    </div>
  );
}

export default Typography;
