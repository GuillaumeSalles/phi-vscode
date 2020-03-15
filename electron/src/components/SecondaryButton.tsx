/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { KeyboardEvent } from "react";
import { primaryButton, colors } from "../styles";

type Props = {
  text: string;
  onClick?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  margin?: string;
  disabled?: boolean;
};

export default React.forwardRef<any, Props>(
  (
    { onClick, onKeyDown, text, margin, disabled }: Props,
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
            margin,
            ":hover": {
              background: colors.secondaryButtonBackground
            }
          }
        ]}
        onClick={onClick}
        onKeyDown={onKeyDown}
        disabled={disabled}
      >
        {text}
      </button>
    );
  }
);
