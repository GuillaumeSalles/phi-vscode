/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState } from "react";
import * as T from "../../../types";
import PaddingEditor from "./PaddingEditor";
import MarginEditor from "./MarginEditor";
import DimensionsEditor from "./DimensionsEditor";
import DisplayEditor from "./DisplayEditor";
import MediaQueriesEditor from "./MediaQueriesEditor";
import { column, row } from "../../../styles";
import TypographyEditor from "./TypographyEditor";

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
