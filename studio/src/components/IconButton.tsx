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
      ":focus": {
        outline: "none"
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
