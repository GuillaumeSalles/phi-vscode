/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import Section from "./Section";
import { SimpleTextPropertyEditor } from "./StylePropertyEditor";

type Props = {
  margin: T.Margin;
  onChange: (margin: T.Margin) => void;
};

export default function MarginEditor({ margin, onChange }: Props) {
  function updateMargin(newProps: Partial<T.Margin>) {
    onChange({ ...margin, ...newProps });
  }

  return (
    <Section title="Margin">
      <div css={row}>
        <SimpleTextPropertyEditor
          label="Top"
          style={margin}
          onChange={onChange}
          property="marginTop"
        />
        <SimpleTextPropertyEditor
          label="Right"
          style={margin}
          onChange={onChange}
          property="marginRight"
        />
        <SimpleTextPropertyEditor
          label="Bottom"
          style={margin}
          onChange={onChange}
          property="marginBottom"
        />
        <SimpleTextPropertyEditor
          label="Left"
          style={margin}
          onChange={onChange}
          property="marginLeft"
        />
      </div>
    </Section>
  );
}
