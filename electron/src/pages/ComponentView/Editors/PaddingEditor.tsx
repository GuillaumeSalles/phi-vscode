/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import Section from "./Section";
import { LengthPropertyEditor } from "./StylePropertyEditor";

type Props = {
  padding: T.Padding;
  onChange: (padding: T.Padding) => void;
};

export default function PaddingEditor({ padding, onChange }: Props) {
  return (
    <Section title="Padding">
      <div css={row}>
        <LengthPropertyEditor
          label="Top"
          style={padding}
          onChange={onChange}
          property="paddingTop"
          onlyPositive={true}
        />
        <LengthPropertyEditor
          label="Right"
          style={padding}
          onChange={onChange}
          property="paddingRight"
          onlyPositive={true}
        />
        <LengthPropertyEditor
          label="Bottom"
          style={padding}
          onChange={onChange}
          property="paddingBottom"
          onlyPositive={true}
        />
        <LengthPropertyEditor
          label="Left"
          style={padding}
          onChange={onChange}
          property="paddingLeft"
          onlyPositive={true}
        />
      </div>
    </Section>
  );
}
