/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import TextAlignEditor from "./TextAlignEditor";
import TextDecorationEditor from "./TextDecorationEditor";
import Section from "./Section";
import {
  ColorEditor,
  FontSizeEditor,
  FontFamilyEditor,
  FontWeightEditor,
  LineHeightEditor,
  LetterSpacingEditor
} from "./StylePropertyEditor";

type Props = {
  style: T.LayerStyle;
  onChange: (style: T.LayerStyle) => void;
  refs: T.Refs;
};

export default function TypographyEditor({ style, onChange, refs }: Props) {
  function updateLayerStyle(newProps: Partial<T.LayerStyle>) {
    onChange({ ...style, ...newProps });
  }

  return (
    <Section title="Typography">
      <div css={[row]}>
        <FontSizeEditor refs={refs} style={style} onChange={updateLayerStyle} />
        <ColorEditor refs={refs} style={style} onChange={updateLayerStyle} />
      </div>
      <div css={row}>
        <FontFamilyEditor
          refs={refs}
          style={style}
          onChange={updateLayerStyle}
        />
        <FontWeightEditor style={style} onChange={updateLayerStyle} />
      </div>
      <div css={row}>
        <LineHeightEditor style={style} onChange={updateLayerStyle} />
        <LetterSpacingEditor style={style} onChange={updateLayerStyle} />
      </div>
      <div css={[row]}>
        <TextAlignEditor style={style} onChange={updateLayerStyle} />
        <TextDecorationEditor style={style} onChange={updateLayerStyle} />
      </div>
    </Section>
  );
}
