/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import useLayerStyleEditor from "./useLayerStyleEditor";
import { column, separator } from "../../../styles";
import DimensionsEditor from "./DimensionsEditor";
import TypographyEditor from "./TypographyEditor";
import MarginEditor from "./MarginEditor";
import PaddingEditor from "./PaddingEditor";
import MediaQueriesEditor from "./MediaQueriesEditor";
import Section from "./Section";
import TextInput from "../../../components/TextInput";
import Field from "../../../components/Field";

type Props = {
  layer: T.LinkLayer;
  onChange: (layer: T.LinkLayer) => void;
  refs: T.Refs;
};

export default function LinkLayerEditor({ layer, onChange, refs }: Props) {
  const {
    style,
    mediaQuery,
    setMediaQuery,
    updateStyle,
    addMediaQuery
  } = useLayerStyleEditor(layer);

  function updateLayer(newProps: Partial<T.LinkLayer>) {
    onChange({ ...layer, ...newProps });
  }

  function updateLayerStyle(newProps: Partial<T.TextLayerStyle>) {
    updateLayer(updateStyle(newProps));
  }

  return (
    <div css={column}>
      <Section title="HTML">
        <Field label="text">
          <TextInput
            cssOverrides={{ width: "100%" }}
            value={layer.text}
            onChange={text => updateLayer({ text })}
          />
        </Field>
        <Field label="href">
          <TextInput
            cssOverrides={{ width: "100%" }}
            value={layer.href}
            onChange={href => updateLayer({ href })}
          />
        </Field>
      </Section>
      <hr css={separator} />
      <MediaQueriesEditor
        selectedId={mediaQuery}
        layer={layer}
        onAdd={addMediaQuery}
        onChange={setMediaQuery}
        refs={refs}
      />
      <hr css={separator} />
      <div css={[column, { flex: "1 1 auto", overflowY: "auto" }]}>
        <TypographyEditor
          style={style}
          onChange={updateLayerStyle}
          refs={refs}
        />
        <hr css={separator} />
        <DimensionsEditor dimensions={style} onChange={updateLayerStyle} />
        <hr css={separator} />
        <MarginEditor margin={style} onChange={updateLayerStyle} />
        <PaddingEditor padding={style} onChange={updateLayerStyle} />
      </div>
    </div>
  );
}
