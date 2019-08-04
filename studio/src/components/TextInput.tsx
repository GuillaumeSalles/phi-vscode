/** @jsx jsx */
import { jsx, Interpolation, css } from "@emotion/core";
import { colors } from "../styles";

type Props = {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  cssOverrides?: Interpolation;
};

function TextInput({ value, onChange, cssOverrides }: Props) {
  const style = css(
    {
      WebkitAppearance: "none",
      borderStyle: "solid",
      borderWidth: "0 0 1px 0",
      borderColor: "transparent",
      height: "24px",
      fontSize: "12px",
      lineHeight: 0,
      padding: 0,
      boxSizing: "border-box",
      outline: "none",
      width: "36px",
      background: "none",
      transition:
        "border 0.2s ease 0s, background 0.2s ease 0s, color 0.2s ease-out 0s",
      ":focus": {
        borderColor: colors.primary
      }
    },
    css(cssOverrides)
  );
  return (
    <input css={style} value={value} onChange={e => onChange(e.target.value)} />
  );
}

export default TextInput;
