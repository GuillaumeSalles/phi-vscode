/** @jsx jsx */
import { jsx } from "@emotion/core";
import { sectionTitle, column } from "../../../styles";

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function Section({ title, children }: Props) {
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
      <h4
        css={[
          sectionTitle,
          {
            margin: "8px"
          }
        ]}
      >
        {title}
      </h4>
      {children}
    </div>
  );
}
