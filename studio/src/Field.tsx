/** @jsx jsx */
import { jsx } from "@emotion/core";
import { column } from "./styles";

type Props = {
  label: string;
  children: React.ReactNode;
};

function Field({ label, children }: Props) {
  return (
    <div css={[column]}>
      <label>{label}</label>
      {children}
    </div>
  );
}

export default Field;
