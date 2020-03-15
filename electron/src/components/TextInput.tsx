/** @jsx jsx */
import { jsx, Interpolation, css } from "@emotion/core";
import { styleEditorInput } from "../styles";

type Props = {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  cssOverrides?: Interpolation;
};

function TextInput({ value, onChange, cssOverrides }: Props) {
  const style = css(styleEditorInput, css(cssOverrides));
  return (
    <input css={style} value={value} onChange={e => onChange(e.target.value)} />
  );
}

export default TextInput;
