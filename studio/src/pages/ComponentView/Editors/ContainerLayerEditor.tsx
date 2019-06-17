/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { column, sectionTitle, separator } from "../../../styles";
import DimensionsEditor from "../../../pages/ComponentView/Editors/DimensionsEditor";
import { useState } from "react";
import MarginEditor from "./MarginEditor";
import PaddingEditor from "./PaddingEditor";
import MediaQueriesEditor from "./MediaQueriesEditor";
import FlexContainerEditor from "./FlexContainerEditor";

type Props = {
  layer: T.ContainerLayer;
  onChange: (layer: T.ContainerLayer) => void;
  refs: T.Refs;
};

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
      <FlexContainerEditor style={style} onChange={updateLayerStyle} />
      <hr css={separator} />
      <DimensionsEditor dimensions={style} onChange={updateLayerStyle} />
      <hr css={separator} />
      <MarginEditor margin={style} onChange={updateLayerStyle} />
      <PaddingEditor padding={style} onChange={updateLayerStyle} />
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

export default ContainerLayerEditor;
