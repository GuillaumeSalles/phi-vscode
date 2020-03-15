/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import Section from "./Section";
import { BackgroundColorEditor, OpacityEditor } from "./StylePropertyEditor";

type Props = {
  style: T.LayerStyle;
  onChange: (style: T.LayerStyle) => void;
  refs: T.Refs;
};

export default function AppearanceEditor({ style, onChange, refs }: Props) {
  return (
    <Section title="Appearance">
      <div css={[row]}>
        <BackgroundColorEditor style={style} onChange={onChange} refs={refs} />
        <OpacityEditor style={style} onChange={onChange} />
      </div>
    </Section>
  );
}
