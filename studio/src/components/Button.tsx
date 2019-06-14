/** @jsx jsx */
import { jsx } from "@emotion/core";
import { primaryButton } from "../styles";

type Props = {
  text: string;
  onClick?: () => void;
};

export default function Button({ text, onClick }: Props) {
  return (
    <button css={primaryButton} onClick={onClick}>
      {text}
    </button>
  );
}
