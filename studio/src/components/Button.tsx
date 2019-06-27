/** @jsx jsx */
import { jsx } from "@emotion/core";
import { primaryButton, colors } from "../styles";

type Props = {
  text: string;
  onClick?: () => void;
};

export default function Button({ text, onClick }: Props) {
  return (
    <button
      css={[
        primaryButton,
        {
          color: "white",
          background: colors.primary
        }
      ]}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
