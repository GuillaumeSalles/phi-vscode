/** @jsx jsx */
import { jsx, Interpolation, css } from "@emotion/core";
import { MouseEventHandler } from "react";

type Props = {
  icon: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  cssOverrides?: Interpolation;
};

export default function IconButton({
  icon,
  onClick,
  disabled,
  cssOverrides = {}
}: Props) {
  const styles = css(
    {
      border: "none",
      margin: 0,
      padding: 0,
      background: "transparent",
      opacity: 0.7,
      cursor: "pointer",
      ":focus": {
        outline: "none",
        opacity: 1
      },
      ":hover": {
        opacity: 1
      },
      ":disabled": {
        opacity: 0.2
      }
    },
    css(cssOverrides)
  );
  return (
    <button disabled={disabled} css={styles} onClick={onClick}>
      {icon}
    </button>
  );
}
