/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { column, row, colors } from "../../../styles";

type Props = {
  title: string;
  children: React.ReactNode;
  topRightButton?: React.ReactNode;
};

const sectionHeader = css([
  row,
  {
    padding: "4px 16px",
    justifyContent: "space-between",
    background: colors.sideBarSectionHeaderBackground
  }
]);

const sectionTitle = css({
  margin: 0,
  fontSize: "11x",
  textTransform: "uppercase",
  letterSpacing: "1.3px",
  fontWeight: "bold",
  color: colors.sideBarSectionHeaderForeground
});

const sectionBody = css([
  column,
  {
    flexShrink: 0,
    padding: "8px"
  }
]);

export default function Section({ title, children, topRightButton }: Props) {
  return (
    <div css={column}>
      <div css={sectionHeader}>
        <h4 css={sectionTitle}>{title}</h4>
        {topRightButton != null && topRightButton}
      </div>
      <div css={sectionBody}>{children}</div>
    </div>
  );
}
