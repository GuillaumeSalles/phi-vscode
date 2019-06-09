/** @jsx jsx */
import { jsx } from "@emotion/core";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

function TextInput({ value, onChange }: Props) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}

export default TextInput;
