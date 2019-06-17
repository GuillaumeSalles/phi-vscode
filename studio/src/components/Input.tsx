/** @jsx jsx */
import { jsx } from "@emotion/core";
import { ChangeEvent } from "react";

type Props = {
  placeholder: string;
  width?: string;
  margin?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  isInvalid?: boolean;
  autoFocus?: boolean;
};

export default function Input({
  autoFocus,
  placeholder,
  width,
  margin,
  onChange,
  value,
  isInvalid
}: Props) {
  return (
    <div
      css={{
        WebkitBoxAlign: "center",
        alignItems: "center",
        display: "inline-flex",
        height: "37px",
        position: "relative",
        verticalAlign: "middle",
        width,
        borderRadius: "5px",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: isInvalid ? "red" : "rgb(225, 225, 225)",
        borderImage: "initial",
        transition: "border 0.2s ease 0s, color 0.2s ease 0s",
        background: "rgb(255, 255, 255)",
        margin
      }}
    >
      <div
        css={{
          display: "block",
          position: "relative",
          width: "100%",
          margin: "4px 10px"
        }}
      >
        <input
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          autoFocus={autoFocus}
          css={{
            boxShadow: "none",
            boxSizing: "border-box",
            display: "block",
            fontSize: "14px",
            lineHeight: "27px",
            width: "100%",
            color: "inherit",
            backgroundColor: "transparent",
            caretColor: "rgb(0, 0, 0)",
            borderRadius: "0px",
            borderWidth: "initial",
            borderStyle: "none",
            borderColor: "initial",
            borderImage: "initial",
            outline: "0px"
          }}
        />
      </div>
    </div>
  );
}
