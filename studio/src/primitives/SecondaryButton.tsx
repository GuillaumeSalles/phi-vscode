/** @jsx jsx */
import { jsx } from "@emotion/core";

type Props = {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  margin?: string;
};

const defaultStyle = {
  "-webkit-appearance": "none",
  position: "relative",
  display: "inline-block",
  verticalAlign: "middle",
  textTransform: "uppercase",
  textAlign: "center",
  lineHeight: "38px",
  whiteSpace: "nowrap",
  minWidth: "200px",
  height: "40px",
  fontWeight: 500,
  fontSize: "12px",
  flexShrink: 0,
  color: "rgb(102, 102, 102)",
  backgroundColor: "rgb(255, 255, 255)",
  userSelect: "none",
  cursor: "pointer",
  textDecoration: "none",
  padding: "0px 25px",
  borderRadius: "5px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "rgb(234, 234, 234)",
  borderImage: "initial",
  transition: "all 0.2s ease 0s",
  overflow: "hidden",
  outline: "none",
  ":hover": {
    color: "rgb(0, 0, 0)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgb(0, 0, 0)",
    borderImage: "initial",
    background: "rgb(255, 255, 255)"
  },
  ":disabled": {
    color: "rgb(204, 204, 204)",
    cursor: "not-allowed",
    filter: "grayscale(1)",
    background: "rgb(250, 250, 250)",
    borderColor: "rgb(234, 234, 234)"
  }
};

const smallStyle = {
  minWidth: "auto",
  height: "24px",
  lineHeight: "22px",
  padding: "0px 10px"
};

export default function SecondaryButton({
  text,
  onClick,
  disabled,
  margin
}: Props) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      css={[defaultStyle, smallStyle, { margin }]}
    >
      {text}
    </button>
  );
}
