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
  fontSizes: T.FontSizesMap;
  applyAction: (action: T.Action) => void;
};

function Typography({
  menu,
  refs,
  fontFamilies,
  fontSizes,
  applyAction
}: Props) {
  return (
    <Layout
      topBar={<TopBar fileName={refs.fileName} isSaved={refs.isSaved} />}
      left={menu}
      center={
        <div css={[column, mainPadding]}>
          <h1 css={[heading, { marginBottom: "20px" }]}>Typography</h1>
          <FontFamilies
            refs={refs}
            fontFamilies={fontFamilies}
            applyAction={applyAction}
          />
          <FontSizes refs={refs} items={fontSizes} applyAction={applyAction} />
        </div>
      }
    />
  );
}

export default Typography;
