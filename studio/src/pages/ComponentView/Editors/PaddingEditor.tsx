/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import Section from "./Section";
import { SimpleTextPropertyEditor } from "./StylePropertyEditor";

type Props = {
  padding: T.Padding;
  onChange: (padding: T.Padding) => void;
};

export default function PaddingEditor({ padding, onChange }: Props) {
  return (
    <Section title="Padding">
      <div css={row}>
        <SimpleTextPropertyEditor
          label="Top"
          style={padding}
          onChange={onChange}
          property="paddingTop"
        />
        <SimpleTextPropertyEditor
          label="Right"
          style={padding}
          onChange={onChange}
          property="paddingRight"
        />
        <SimpleTextPropertyEditor
          label="Bottom"
          style={padding}
          onChange={onChange}
          property="paddingBottom"
        />
        <SimpleTextPropertyEditor
          label="Left"
          style={padding}
          onChange={onChange}
          property="paddingLeft"
        />
      </div>
    </Section>
  );
}
