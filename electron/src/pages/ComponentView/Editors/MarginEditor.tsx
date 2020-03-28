/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import Section from "./Section";
import { LengthPropertyEditor } from "./StylePropertyEditor";

type Props = {
  margin: T.Margin;
  onChange: (margin: T.Margin) => void;
};

export default function MarginEditor({ margin, onChange }: Props) {
  return (
    <Section title="Margin">
      <div css={row}>
        <LengthPropertyEditor
          label="Top"
          style={margin}
          onChange={onChange}
          property="marginTop"
          onlyPositive={false}
        />
        <LengthPropertyEditor
          label="Right"
          style={margin}
          onChange={onChange}
          property="marginRight"
          onlyPositive={false}
        />
        <LengthPropertyEditor
          label="Bottom"
          style={margin}
          onChange={onChange}
          property="marginBottom"
          onlyPositive={false}
        />
        <LengthPropertyEditor
          label="Left"
          style={margin}
          onChange={onChange}
          property="marginLeft"
          onlyPositive={false}
        />
      </div>
    </Section>
  );
}
