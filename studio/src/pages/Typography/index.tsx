/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import { column, mainPadding, heading } from "../../styles";
import FontFamilies from "./FontFamilies";
import FontSizes from "./FontSizes";
import { Layout } from "../../components/Layout";
import TopBar from "../../components/TopBar";

type Props = {
  menu: React.ReactNode;
  refs: T.Refs;

  fontFamilies: T.FontFamiliesMap;
  onFontFamiliesChange: (fontFamilies: T.FontFamiliesMap) => void;

  fontSizes: T.FontSizesMap;
  onFontSizesChange: (fontSizes: T.FontSizesMap) => void;
};

function Typography({
  menu,
  refs,
  fontFamilies,
  onFontFamiliesChange,
  fontSizes,
  onFontSizesChange
}: Props) {
  return (
    <Layout
      topBar={<TopBar fileName={refs.fileName} isSaved={refs.isSaved} />}
      left={menu}
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
