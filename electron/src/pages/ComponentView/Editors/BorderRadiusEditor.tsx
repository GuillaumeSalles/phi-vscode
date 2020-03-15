/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import Section from "./Section";
import { SimpleTextPropertyEditor } from "./StylePropertyEditor";

type Props = {
  style: T.LayerStyle;
  onChange: (style: T.LayerStyle) => void;
};

export default function BorderRadius({ style, onChange }: Props) {
  return (
    <Section title="Border Radius">
      <div css={row}>
        <SimpleTextPropertyEditor
          label="T/L"
          style={style}
          onChange={onChange}
          property="borderTopLeftRadius"
        />
        <SimpleTextPropertyEditor
          label="T/R"
          style={style}
          onChange={onChange}
          property="borderTopRightRadius"
        />
        <SimpleTextPropertyEditor
          label="B/R"
          style={style}
          onChange={onChange}
          property="borderBottomRightRadius"
        />
        <SimpleTextPropertyEditor
          label="B/L"
          style={style}
          onChange={onChange}
          property="borderBottomLeftRadius"
        />
      </div>
    </Section>
  );
}
