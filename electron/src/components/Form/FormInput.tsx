/** @jsx jsx */
import { jsx } from "@emotion/core";
import { ChangeEvent, KeyboardEvent, forwardRef } from "react";
import { colors, textInput } from "../../styles";

type Props = {
  placeholder: string;
  width?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  value?: string;
  isInvalid?: boolean;
  error?: string;
};

export default forwardRef<HTMLInputElement, Props>(
  (
    {
      placeholder,
      width,
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      value,
      error
    }: Props,
    ref: React.Ref<HTMLInputElement>
  ) => {
    return (
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          verticalAlign: "middle",
          width,
          margin: "8px 0"
        }}
      >
        <input
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          ref={ref}
          css={textInput}
        />
        <div
          css={{
            fontSize: "12px",
            color: "red",
            alignSelf: "flex-start",
            display: error !== undefined ? "block" : "none"
          }}
        >
          {error}
        </div>
      </div>
    );
  }
);
