/** @jsx jsx */
import { jsx } from "@emotion/core";
import { primaryButton } from "../styles";
import React, { KeyboardEvent } from "react";

type Props = {
  text: string;
  onClick?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  margin?: string;
};

export default React.forwardRef<any, Props>(
  (
    { onClick, onKeyDown, text, margin }: Props,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        ref={ref}
        css={[
          primaryButton,
          {
            color: "white",
            margin
          }
        ]}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        {text}
      </button>
    );
  }
);
