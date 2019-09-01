/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import Section from "./Section";
import {
  PositionPropertyEditor,
  SimpleTextPropertyEditor
} from "./StylePropertyEditor";

type Props = {
  style: T.LayerStyle;
  onChange: (style: T.LayerStyle) => void;
};

export default function PositionEditor({ style, onChange }: Props) {
  return (
    <Section title="Position">
      <PositionPropertyEditor style={style} onChange={onChange} />
      {style.position === "absolute" && (
        <div css={[row]}>
          <SimpleTextPropertyEditor
            label="Top"
            style={style}
            onChange={onChange}
            property="top"
          />
          <SimpleTextPropertyEditor
            label="Right"
            style={style}
            onChange={onChange}
            property="right"
          />
          <SimpleTextPropertyEditor
            label="Bottom"
            style={style}
            onChange={onChange}
            property="bottom"
          />
          <SimpleTextPropertyEditor
            label="Left"
            style={style}
            onChange={onChange}
            property="left"
          />
        </div>
      )}
    </Section>
  );
}
