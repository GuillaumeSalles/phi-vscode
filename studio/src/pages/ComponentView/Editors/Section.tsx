/** @jsx jsx */
import { jsx } from "@emotion/core";
import { sectionTitle, column, row } from "../../../styles";

type Props = {
  title: string;
  children: React.ReactNode;
  topRightButton?: React.ReactNode;
};

export default function Section({ title, children, topRightButton }: Props) {
  return (
    <div
      css={[
        column,
        {
          padding: "4px 8px",
          margin: "4px 0",
          borderBottom: "solid 1px #DDD"
        }
      ]}
    >
      <div
        css={[
          row,
          {
            margin: "0 8px",
            justifyContent: "space-between"
          }
        ]}
      >
        <h4 css={[sectionTitle]}>{title}</h4>
        {topRightButton != null && topRightButton}
      </div>
      {children}
    </div>
  );
}
