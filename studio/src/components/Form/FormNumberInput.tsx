/** @jsx jsx */
import { jsx } from "@emotion/core";
import { ChangeEvent } from "react";

type Props = {
  placeholder: string;
  width?: string;
  margin?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: number;
  error?: string;
};

export default function FormNumberInput({
  placeholder,
  width,
  margin,
  onChange,
  onBlur,
  onFocus,
  error,
  value
}: Props) {
  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        verticalAlign: "middle",
        width,
        margin
      }}
    >
      <input
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        onFocus={onFocus}
        type="number"
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
          margin: "4px 10px",
          borderRadius: "2px",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "rgb(225, 225, 225)",
          borderImage: "initial",
          transition: "border 0.2s ease 0s, color 0.2s ease 0s",
          background: "rgb(255, 255, 255)",
          padding: "4px 10px"
        }}
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
