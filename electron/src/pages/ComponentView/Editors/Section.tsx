/** @jsx jsx */
import { jsx } from "@emotion/core";
import { sectionTitle, column, row, colors } from "../../../styles";

type Props = {
  title: string;
  children: React.ReactNode;
  topRightButton?: React.ReactNode;
};

export default function Section({ title, children, topRightButton }: Props) {
  return (
    <div css={[column]}>
      <div
        css={[
          row,
          {
            padding: "4px 16px",
            justifyContent: "space-between",
            background: colors.sideBarSectionHeaderBackground
          }
        ]}
      >
        <h4
          css={{
            margin: 0,
            fontSize: "11x",
            textTransform: "uppercase",
            letterSpacing: "1.3px",
            fontWeight: "bold",
            color: colors.sideBarSectionHeaderForeground
          }}
        >
          {title}
        </h4>
        {topRightButton != null && topRightButton}
      </div>
      <div
        css={[
          column,
          {
            flexShrink: 0,
            padding: "8px"
          }
        ]}
      >
        {children}
      </div>
    </div>
  );
}
