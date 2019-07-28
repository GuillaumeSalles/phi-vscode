/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import useLayerStyleEditor from "./useLayerStyleEditor";
import { column } from "../../../styles";
import Field from "../../../components/Field";
import DimensionsEditor from "./DimensionsEditor";
import Select from "../../../components/Select";
import TypographyEditor from "./TypographyEditor";
import MarginEditor from "./MarginEditor";
import PaddingEditor from "./PaddingEditor";
import TextAreaInput from "../../../components/TextAreaInput";
import MediaQueriesEditor from "./MediaQueriesEditor";
import Section from "./Section";
import { listToEntries } from "../../../utils";
import DisplayEditor from "./DisplayEditor";

type Props = {
  layer: T.TextLayer;
  onChange: (layer: T.TextLayer) => void;
  refs: T.Refs;
};

const tags: T.TextLayerTag[] = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span"
];
const tagsOptions = listToEntries(tags);

function TextLayerEditor({ layer, onChange, refs }: Props) {
  const {
    style,
    mediaQuery,
    setMediaQuery,
    updateStyle,
    addMediaQuery
  } = useLayerStyleEditor(layer, mediaQueries => updateLayer({ mediaQueries }));

  function updateLayer(newProps: Partial<T.TextLayer>) {
    onChange({ ...layer, ...newProps });
  }

  function updateLayerStyle(newProps: Partial<T.TextLayerStyle>) {
    updateLayer(updateStyle(newProps));
  }

  return (
    <div css={column}>
      <Section title="HTML">
        <Field label="Tag">
          <Select
            value={layer.tag}
            onChange={tag => updateLayer({ tag })}
            options={tagsOptions}
          />
        </Field>
        <div css={{ padding: "0 4px" }}>
          <TextAreaInput
            placeholder="Text"
            value={layer.text}
            onChange={text => updateLayer({ text })}
          />
        </div>
      </Section>
      <MediaQueriesEditor
        selectedId={mediaQuery}
        layer={layer}
        onAdd={addMediaQuery}
        onChange={setMediaQuery}
        refs={refs}
      />
      <div css={[column, { flex: "1 1 auto", overflowY: "auto" }]}>
        <DisplayEditor style={style} onChange={updateLayerStyle} />
        <TypographyEditor
          style={style}
          onChange={updateLayerStyle}
          refs={refs}
        />
        <DimensionsEditor dimensions={style} onChange={updateLayerStyle} />
        <MarginEditor margin={style} onChange={updateLayerStyle} />
        <PaddingEditor padding={style} onChange={updateLayerStyle} />
      </div>
    </div>
  );
}

export default TextLayerEditor;
