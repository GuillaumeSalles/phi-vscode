/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { KeyboardEvent } from "react";
import { primaryButton } from "../styles";

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
            color: "#333333",
            background: "#E8E8E8",
            margin
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
