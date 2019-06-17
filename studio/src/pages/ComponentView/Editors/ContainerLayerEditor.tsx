/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { column, sectionTitle, row, separator } from "../../../styles";
import Select from "../../../components/Select";
import Field from "../../../components/Field";
import DimensionsEditor from "../../../pages/ComponentView/Editors/DimensionsEditor";
import ColorInput from "../../../components/ColorInput";
import { useState } from "react";
import TextAreaInput from "../../../components/TextAreaInput";
import NumberInput from "../../../components/NumberInput";
import TextAlignEditor from "./TextAlignEditor";
import MarginEditor from "./MarginEditor";
import PaddingEditor from "./PaddingEditor";
import MediaQueriesEditor from "./MediaQueriesEditor";
import Section from "./Section";
import { flexDirections } from "../../../constants";

type Props = {
  layer: T.ContainerLayer;
  onChange: (layer: T.ContainerLayer) => void;
  refs: T.Refs;
};

const flexDirectionsOptions: [T.FlexDirection, string][] = flexDirections.map(
  x => [x, x]
);

function ContainerLayerEditor({ layer, onChange, refs }: Props) {
  const [mediaQuery, setMediaQuery] = useState("default");
  const isDefault = mediaQuery === "default";
  const style = isDefault
    ? layer.style
    : layer.mediaQueries.find(mq => mq.id === mediaQuery)!.style;

  function updateLayer(newProps: Partial<T.ContainerLayer>) {
    onChange({ ...layer, ...newProps });
  }

  function updateLayerStyle(newProps: Partial<T.ContainerLayerStyle>) {
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
        {/* <Field label="Tag">
          <Select
            value={layer.tag}
            onChange={tag => updateLayer({ tag })}
            options={tagsOptions}
          />
        </Field> */}
      </div>
      <hr css={separator} />
      <Section title="Flex Container">
        <Field label="Direction">
          <Select
            value={style.flexDirection}
            onChange={flexDirection => updateLayerStyle({ flexDirection })}
            options={flexDirectionsOptions}
          />
        </Field>
      </Section>
      <DimensionsEditor dimensions={style} onChange={updateLayerStyle} />
      <hr css={separator} />
      <MarginEditor margin={style} onChange={updateLayerStyle} />
      <PaddingEditor padding={style} onChange={updateLayerStyle} />
      <hr css={separator} />
      <MediaQueriesEditor
        selectedId={mediaQuery}
        items={layer.mediaQueries}
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

export default ContainerLayerEditor;
