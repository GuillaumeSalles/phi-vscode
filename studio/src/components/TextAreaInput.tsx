/** @jsx jsx */
import { jsx } from "@emotion/core";
import { colors, styleEditorInput } from "../styles";

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
      css={[
        styleEditorInput,
        {
          height: "72px",
          resize: "none"
        }
      ]}
      onChange={e => onChange(e.target.value)}
    />
  );
}
