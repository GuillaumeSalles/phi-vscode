/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState } from "react";
import * as T from "../../../types";
import PaddingEditor from "./PaddingEditor";
import MarginEditor from "./MarginEditor";
import DimensionsEditor from "./DimensionsEditor";
import DisplayEditor from "./DisplayEditor";
import MediaQueriesEditor from "./MediaQueriesEditor";
import { column } from "../../../styles";
import Section from "./Section";
import Field from "../../../components/Field";
import Select from "../../../components/Select";
import { listToEntries } from "../../../utils";
import TextAreaInput from "../../../components/TextAreaInput";
import TextInput from "../../../components/TextInput";
import TypographyEditor from "./TypographyEditor";

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
const textTagsOptions = listToEntries(tags);

function HtmlEditor(props: {
  layer: T.Layer;
  updateLayer: (layer: Partial<T.Layer>) => void;
}) {
  const { updateLayer } = props;
  switch (props.layer.type) {
    case "text":
      return (
        <Section title="HTML">
          <Field label="Tag">
            <Select
              value={props.layer.tag}
              onChange={tag => updateLayer({ tag })}
              options={textTagsOptions}
            />
          </Field>
          <div css={{ padding: "0 4px" }}>
            <TextAreaInput
              placeholder="Text"
              value={props.layer.text}
              onChange={text => updateLayer({ text })}
            />
          </div>
        </Section>
      );
    case "container":
      return null;
    case "link":
      return (
        <Section title="HTML">
          <Field label="text">
            <TextInput
              cssOverrides={{ width: "100%" }}
              value={props.layer.text}
              onChange={text => updateLayer({ text })}
            />
          </Field>
          <Field label="href">
            <TextInput
              cssOverrides={{ width: "100%" }}
              value={props.layer.href}
              onChange={href => updateLayer({ href })}
            />
          </Field>
        </Section>
      );
  }
}

type Props<TLayer> = {
  layer: TLayer;
  onChange: (layer: TLayer) => void;
  refs: T.Refs;
};

export default function LayerEditor<TLayer extends T.Layer>({
  layer,
  onChange,
  refs
}: Props<TLayer>) {
  const [mediaQuery, setMediaQuery] = useState("default");
  const isDefault = mediaQuery === "default";
  const style = isDefault
    ? layer.style
    : layer.mediaQueries.find(mq => mq.id === mediaQuery)!.style;

  const updateStyle = (newProps: Partial<T.LayerStyle>): Partial<T.Layer> => {
    return isDefault
      ? { style: { ...style, ...newProps } }
      : {
          mediaQueries: layer.mediaQueries.map(mq =>
            mq.id === mediaQuery
              ? {
                  ...mq,
                  style: { ...style, ...newProps }
                }
              : mq
          )
        };
  };

  const addMediaQuery = (id: string, breakpoint: T.Ref): void => {
    updateLayer({
      mediaQueries: [
        ...layer.mediaQueries,
        {
          id,
          minWidth: breakpoint,
          style: { ...layer.style }
        }
      ]
    });
    setMediaQuery(id);
  };

  function updateLayer(newProps: Partial<T.Layer>) {
    onChange({ ...layer, ...newProps });
  }

  function updateLayerStyle(newProps: Partial<T.LayerStyle>) {
    updateLayer(updateStyle(newProps));
  }

  return (
    <div css={column}>
      <HtmlEditor layer={layer} updateLayer={updateLayer} />
      <MediaQueriesEditor
        selectedId={mediaQuery}
        layer={layer}
        onAdd={addMediaQuery}
        onChange={setMediaQuery}
        refs={refs}
      />
      <div css={[column, { flex: "1 1 auto", overflowY: "auto" }]}>
        <DisplayEditor
          allowedDisplays={["flex", "block", "inline", "none"]}
          style={style}
          onChange={updateLayerStyle}
        />
        {style.display !== "none" && layer.type !== "container" && (
          <TypographyEditor
            style={style}
            onChange={updateLayerStyle}
            refs={refs}
          />
        )}
        {style.display !== "none" && (
          <React.Fragment>
            <DimensionsEditor dimensions={style} onChange={updateLayerStyle} />
            <MarginEditor margin={style} onChange={updateLayerStyle} />
            <PaddingEditor padding={style} onChange={updateLayerStyle} />
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
