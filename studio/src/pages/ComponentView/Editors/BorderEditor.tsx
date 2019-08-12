/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import Section from "./Section";
import {
  BorderWidthEditor,
  BorderColorEditor,
  BorderStyleEditor
} from "./StylePropertyEditor";

type Props = {
  style: T.LayerStyle;
  onChange: (style: T.LayerStyle) => void;
  refs: T.Refs;
};

export default function BorderEditor({ style, onChange, refs }: Props) {
  return (
    <Section title="Border">
      <div css={row}>
        <BorderWidthEditor style={style} onChange={onChange} label="Width" />
        <BorderColorEditor
          style={style}
          onChange={onChange}
          refs={refs}
          label="Color"
        />
        <BorderStyleEditor style={style} onChange={onChange} label="Style" />
      </div>
    </Section>
  );
}
