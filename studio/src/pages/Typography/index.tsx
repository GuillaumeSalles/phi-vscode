/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import { column, mainPadding, heading } from "../../styles";
import FontFamilies from "./FontFamilies";
import FontSizes from "./FontSizes";
import { Layout } from "../../components/Layout";
import Menu from "../../Menu";

type Props = {
  components: T.Component[];

  fontFamilies: T.FontFamiliesMap;
  onFontFamiliesChange: (fontFamilies: T.FontFamiliesMap) => void;

  fontSizes: T.FontSizesMap;
  onFontSizesChange: (fontSizes: T.FontSizesMap) => void;
};

function Typography({
  components,
  fontFamilies,
  onFontFamiliesChange,
  fontSizes,
  onFontSizesChange
}: Props) {
  return (
    <Layout
      left={<Menu components={components} />}
      center={
        <div css={[column, mainPadding]}>
          <h1 css={[heading, { marginBottom: "20px" }]}>Typography</h1>
          <FontFamilies
            fontFamilies={fontFamilies}
            onFontFamiliesChange={onFontFamiliesChange}
          />
          <FontSizes items={fontSizes} onItemsChange={onFontSizesChange} />
        </div>
      }
    />
  );
}

export default Typography;
