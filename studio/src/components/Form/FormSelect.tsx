/** @jsx jsx */
import { jsx, Interpolation, css } from "@emotion/core";
import { ChangeEvent, KeyboardEvent, forwardRef } from "react";
import { colors } from "../../styles";

type Props<TValue> = {
  width?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: ChangeEvent<HTMLSelectElement>) => void;
  onFocus?: (event: ChangeEvent<HTMLSelectElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLSelectElement>) => void;
  value?: string;
  isInvalid?: boolean;
  error?: string;
  options: Array<[TValue, string]>;
  placeholder: string;
  cssOverrides?: Interpolation;
};

export default forwardRef<HTMLSelectElement, Props<string>>(
  (
    {
      width,
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      value,
      placeholder,
      error,
      options,
      cssOverrides
    }: Props<string>,
    ref: React.Ref<HTMLSelectElement>
  ) => {
    const containerStyle = css(
      {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        verticalAlign: "middle",
        width,
        margin: "8px 0"
      },
      css(cssOverrides)
    );
    return (
      <div css={containerStyle}>
        <select
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          ref={ref}
          css={{
            boxShadow: "none",
            boxSizing: "border-box",
            display: "block",
            fontSize: "14px",
            lineHeight: "27px",
            height: "28px",
            width: "100%",
            backgroundColor: "transparent",
            caretColor: "rgb(0, 0, 0)",
            border: "none",
            outline: "0px",
            borderRadius: "2px",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "rgb(225, 225, 225)",
            borderImage: "initial",
            transition: "border 0.2s ease 0s, color 0.2s ease 0s",
            background: "rgb(255, 255, 255)",
            padding: "4px 10px"
          }}
        >
          {options.map(option => (
            <option key={option[0]} value={option[0]}>
              {option[1]}
            </option>
          ))}
        </select>
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
