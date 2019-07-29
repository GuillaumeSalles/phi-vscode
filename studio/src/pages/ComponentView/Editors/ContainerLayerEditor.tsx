/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { column } from "../../../styles";
import DimensionsEditor from "./DimensionsEditor";
import MarginEditor from "./MarginEditor";
import PaddingEditor from "./PaddingEditor";
import MediaQueriesEditor from "./MediaQueriesEditor";
import DisplayEditor from "./DisplayEditor";
import useLayerStyleEditor from "./useLayerStyleEditor";

type Props = {
  layer: T.ContainerLayer;
  onChange: (layer: T.ContainerLayer) => void;
  refs: T.Refs;
};

function ContainerLayerEditor({ layer, onChange, refs }: Props) {
  const {
    style,
    mediaQuery,
    setMediaQuery,
    updateStyle,
    addMediaQuery
  } = useLayerStyleEditor(layer, mediaQueries => updateLayer({ mediaQueries }));

  function updateLayer(newProps: Partial<T.ContainerLayer>) {
    onChange({ ...layer, ...newProps });
  }

  function updateLayerStyle(newProps: Partial<T.ContainerLayerStyle>) {
    updateLayer(updateStyle(newProps));
  }

  return (
    <div css={column}>
      {/* <div css={[column, { flex: "0 0 auto", padding: "8px" }]}>
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
      </div> */}
      <MediaQueriesEditor
        selectedId={mediaQuery}
        layer={layer}
        onAdd={addMediaQuery}
        onChange={setMediaQuery}
        refs={refs}
      />
      <DisplayEditor
        allowedDisplays={["flex", "block", "none"]}
        style={style}
        onChange={updateLayerStyle}
      />
      {style.display !== "none" && (
        <DimensionsEditor dimensions={style} onChange={updateLayerStyle} />
      )}
      {style.display !== "none" && (
        <MarginEditor margin={style} onChange={updateLayerStyle} />
      )}
      {style.display !== "none" && (
        <PaddingEditor padding={style} onChange={updateLayerStyle} />
      )}
    </div>
  );
}

export default ContainerLayerEditor;
