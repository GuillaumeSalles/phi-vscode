/** @jsx jsx */
import { jsx, Interpolation, css } from "@emotion/core";
import React, { KeyboardEvent } from "react";
import { primaryButton, colors } from "../styles";

type Props = {
  onClick?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children: React.ReactNode;
  cssOverrides?: Interpolation;
};

export default React.forwardRef<any, Props>(
  (
    { onClick, onKeyDown, disabled, children, cssOverrides }: Props,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        ref={ref}
        css={[
          primaryButton,
          {
            background: colors.secondaryButtonBackground,
            color: colors.secondaryButtonForeground,
            padding: "4px",
            ":hover": {
              background: colors.secondaryButtonBackground
            }
          },
          css(cssOverrides)
        ]}
        onClick={onClick}
        onKeyDown={onKeyDown}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
);
