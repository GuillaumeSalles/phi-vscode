/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState, useCallback } from "react";
import * as T from "../../../types";
import PaddingEditor from "./PaddingEditor";
import MarginEditor from "./MarginEditor";
import DimensionsEditor from "./DimensionsEditor";
import LayerDisplayEditor from "./LayerDisplayEditor";
import MediaQueriesEditor from "./MediaQueriesEditor";
import AppearanceEditor from "./AppearanceEditor";
import BorderEditor from "./BorderEditor";
import BorderRadiusEditor from "./BorderRadiusEditor";
import PositionEditor from "./PositionEditor";
import { column } from "../../../styles";
import StyleOverridesEditor from "./StyleOverridesEditor";
import TypographyEditor from "./TypographyEditor";
import {
  assertUnreachable,
  stopKeydownPropagationIfNecessary,
} from "../../../utils";
import { uiStateComponentOrThrow } from "../../../refsUtil";

type Props<TLayer> = {
  layer: TLayer;
  parentLayer?: T.Layer;
  refs: T.Refs;
  componentId: string;
  applyAction: T.ApplyAction;
};

function layerTypeToSupportedDisplay(type: T.LayerType): T.DisplayProperty[] {
  switch (type) {
    case "container":
    case "link":
      return ["flex", "block", "inline", "none"];
    case "text":
    case "image":
      return ["block", "inline", "none"];
    case "component":
      return [];
  }
  assertUnreachable(type);
}

export default function LayerEditor<TLayer extends T.Layer>({
  layer,
  componentId,
  applyAction,
  refs,
  parentLayer,
}: Props<TLayer>) {
  const uiState = uiStateComponentOrThrow(refs);
  const mediaQuery = uiState.mediaQuery;
  const isDefault = mediaQuery == null;
  const style = isDefault
    ? layer.style
    : layer.mediaQueries.find((mq) => mq.id === mediaQuery)!.style;

  const addMediaQuery = (id: string, breakpoint: T.Ref): void => {
    applyAction({
      type: "addMediaQuery",
      componentId,
      layerId: layer.id,
      mediaQueryId: id,
      breakpointId: breakpoint.id,
    });
  };

  const updateLayerStyle = useCallback(
    (style: Partial<T.LayerStyle>) => {
      applyAction({
        type: "updateLayerStyle",
        style,
      });
    },
    [applyAction, mediaQuery]
  );

  // TODO: Component styling
  if (layer.type === "component") {
    return null;
  }

  return (
    <div
      css={[column, { overflowY: "hidden" }]}
      onKeyDown={stopKeydownPropagationIfNecessary}
    >
      <div css={{ flex: "0 0 auto" }}>
        <MediaQueriesEditor
          selectedId={mediaQuery}
          layer={layer}
          onAdd={addMediaQuery}
          onChange={(mediaQuery) =>
            applyAction({ type: "selectMediaQuery", mediaQuery })
          }
          refs={refs}
        />
      </div>

      <div css={[column, { flex: "1 1 auto", overflowY: "auto" }]}>
        {parentLayer != null && (
          <PositionEditor
            style={style}
            onChange={updateLayerStyle}
            parentStyle={parentLayer.style}
            applyAction={applyAction}
          />
        )}
        <DimensionsEditor dimensions={style} onChange={updateLayerStyle} />
        <LayerDisplayEditor
          allowedDisplays={layerTypeToSupportedDisplay(layer.type)}
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
            {parentLayer != null && (
              <MarginEditor margin={style} onChange={updateLayerStyle} />
            )}
            <PaddingEditor padding={style} onChange={updateLayerStyle} />
            <AppearanceEditor
              style={style}
              onChange={updateLayerStyle}
              refs={refs}
            />
            <BorderEditor
              style={style}
              onChange={updateLayerStyle}
              refs={refs}
            />
            <BorderRadiusEditor style={style} onChange={updateLayerStyle} />
            <StyleOverridesEditor
              layer={layer}
              style={style}
              onChange={updateLayerStyle}
              refs={refs}
            />
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
