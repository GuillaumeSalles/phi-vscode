/** @jsx jsx */
import { jsx } from "@emotion/core";
import { colors } from "../styles";

type Props = {
  placeholder?: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

export default function TextAreaInput({ placeholder, value, onChange }: Props) {
  return (
    <textarea
      rows={3}
      value={value}
      placeholder={placeholder}
      css={{
        WebkitAppearance: "none",
        background: "#F7F7F7",
        borderStyle: "solid",
        borderWidth: "0 0 1px 0",
        borderColor: "transparent",
        fontSize: "12px",
        height: "72px",
        resize: "none",
        padding: "4px",
        boxSizing: "border-box",
        outline: "none",
        width: "100%",
        transition:
          "border 0.2s ease 0s, background 0.2s ease 0s, color 0.2s ease-out 0s",
        ":focus": {
          borderColor: colors.primary
        }
      }}
      onChange={e => onChange(e.target.value)}
    />
  );
}
