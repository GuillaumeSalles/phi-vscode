/** @jsx jsx */
import { jsx } from "@emotion/core";
import { column, colors } from "../styles";

type Props = {
  label: string;
  children: React.ReactNode;
};

function Field({ label, children }: Props) {
  return (
    <div css={[column, { margin: "4px 8px" }]}>
      <label css={{ fontSize: "12px", color: colors.sideBarForeground }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default Field;
