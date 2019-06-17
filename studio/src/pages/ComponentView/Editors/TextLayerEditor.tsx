/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { column, row, sectionTitle, separator } from "../../../styles";
import Field from "../../../components/Field";
import DimensionsEditor from "./DimensionsEditor";
import Select from "../../../components/Select";
import ColorInput from "../../../components/ColorInput";
import NumberInput from "../../../components/NumberInput";
import MarginEditor from "./MarginEditor";
import PaddingEditor from "./PaddingEditor";
import TextAlignEditor from "./TextAlignEditor";
import TextAreaInput from "../../../components/TextAreaInput";
import { useState } from "react";
import MediaQueriesEditor from "./MediaQueriesEditor";
import Section from "./Section";

type Props = {
  layer: T.TextLayer;
  onChange: (layer: T.TextLayer) => void;
  refs: T.Refs;
};

const tags: T.TextLayerTag[] = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
const tagsOptions: [T.TextLayerTag, string][] = tags.map(t => [t, t]);

function TextLayerEditor({ layer, onChange, refs }: Props) {
  const [mediaQuery, setMediaQuery] = useState("default");
  const isDefault = mediaQuery === "default";
  const style = isDefault
    ? layer.style
    : layer.mediaQueries.find(mq => mq.id === mediaQuery)!.style;

  function updateLayer(newProps: Partial<T.TextLayer>) {
    onChange({ ...layer, ...newProps });
  }

  function updateLayerStyle(newProps: Partial<T.TextLayerStyle>) {
    if (isDefault) updateLayer({ style: { ...style, ...newProps } });
    else {
      const mq = layer.mediaQueries.find(mq => mq.id === mediaQuery)!;
      updateLayer({
        mediaQueries: layer.mediaQueries.map(mq =>
          mq.id === mediaQuery
            ? {
                ...mq,
                style: { ...style, ...newProps }
              }
            : mq
        )
      });
    }
  }

  return (
    <div css={column}>
      <div css={[column, { flex: "0 0 auto", padding: "8px" }]}>
        <h4
          css={[
            sectionTitle,
            {
              margin: "8px"
            }
          ]}
        >
          HTML
        </h4>
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
      </div>
      <hr css={separator} />
      <div css={[column, { flex: "1 1 auto", overflowY: "auto" }]}>
        <Section title="Typography">
          <div css={[row]}>
            <Field label="Font size">
              <Select
                value={style.fontSize.id}
                onChange={value =>
                  updateLayerStyle({ fontSize: { type: "ref", id: value } })
                }
                options={Array.from(refs.fontSizes.entries()).map(entry => [
                  entry[0],
                  entry[1].name
                ])}
              />
            </Field>
            <Field label="Color">
              <ColorInput
                colors={refs.colors}
                value={style.color}
                onChange={value => updateLayerStyle({ color: value })}
              />
            </Field>
          </div>
          <div css={row}>
            <Field label="Font family">
              <Select
                value={style.fontFamily.id}
                onChange={value =>
                  updateLayerStyle({ fontFamily: { type: "ref", id: value } })
                }
                options={Array.from(refs.fontFamilies.entries()).map(entry => [
                  entry[0],
                  entry[1].name
                ])}
              />
            </Field>
            <Field label="Font weight">
              <Select
                value={style.fontWeight.id}
                onChange={value =>
                  updateLayerStyle({ fontWeight: { type: "ref", id: value } })
                }
                options={Array.from(refs.fontWeights.entries()).map(entry => [
                  entry[0],
                  entry[1].name
                ])}
              />
            </Field>
          </div>
          <div css={row}>
            <Field label="Line">
              <NumberInput
                value={style.lineHeight}
                onChange={lineHeight =>
                  updateLayerStyle({
                    lineHeight: lineHeight === null ? 1.2 : lineHeight
                  })
                }
              />
            </Field>
            <Field label="Letter">
              <NumberInput
                step={0.5}
                value={style.letterSpacing ? style.letterSpacing.value : 0}
                onChange={value =>
                  updateLayerStyle({
                    letterSpacing:
                      value !== null ? { type: "px", value } : undefined
                  })
                }
              />
            </Field>
          </div>
          <TextAlignEditor
            value={style.textAlign}
            onChange={textAlign => updateLayerStyle({ textAlign })}
          />
        </Section>
        <hr css={separator} />
        <DimensionsEditor dimensions={style} onChange={updateLayerStyle} />
        <hr css={separator} />
        <MarginEditor margin={style} onChange={updateLayerStyle} />
        <PaddingEditor padding={style} onChange={updateLayerStyle} />
      </div>
      <hr css={separator} />
      <MediaQueriesEditor
        selectedId={mediaQuery}
        layer={layer}
        onAdd={(id, breakpoint) => {
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
        }}
        onChange={setMediaQuery}
        refs={refs}
      />
    </div>
  );
}

export default TextLayerEditor;
