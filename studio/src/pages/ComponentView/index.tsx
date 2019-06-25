/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useEffect } from "react";
import { column, mainPadding, heading, row } from "../../styles";
import * as T from "../../types";
import Component from "./Component";
import SecondaryButton from "../../components/SecondaryButton";
import { useState } from "react";
import LayersTree from "../../components/LayersTree";
import LayerEditor from "./Editors/LayerEditor";
import { Layout } from "../../components/Layout";
import TopBar from "../../components/TopBar";
import { findLayerById, updateLayer } from "../../layerUtils";

type Props = {
  menu: React.ReactNode;
  componentId: string;
  onComponentChange: (component: T.Component) => void;
  refs: T.Refs;
};

function ComponentView({ menu, componentId, onComponentChange, refs }: Props) {
  const component = refs.components.get(componentId)!;
  const [layerId, setLayerId] = useState<string | undefined>(
    component.layout ? component.layout.id : undefined
  );

  // Select component layer root when componentId change
  useEffect(() => {
    setLayerId(component.layout ? component.layout.id : undefined);
  }, [componentId]);

  const [isEditing, setIsEditing] = useState(false);
  const selectedLayer =
    component.layout && layerId
      ? findLayerById(component.layout, layerId)
      : undefined;

  function updateComponentLayer(newLayer: T.Layer) {
    const newComponent = {
      ...component,
      layout: updateLayer(component.layout, newLayer)
    };
    setLayerId(newLayer.id);
    onComponentChange(newComponent);
  }

  function updateComponentRootLayer(newLayer: T.Layer | undefined) {
    const newComponent = {
      ...component,
      layout: newLayer
    };
    setLayerId(newLayer ? newLayer.id : undefined);
    onComponentChange(newComponent);
  }

  return (
    <Layout
      topBar={<TopBar fileName={refs.fileName} isSaved={refs.isSaved} />}
      left={
        isEditing ? (
          <LayersTree
            root={component.layout}
            onSelectLayer={setLayerId}
            selectedLayerId={layerId}
            onLayerChange={updateComponentRootLayer}
            refs={refs}
          />
        ) : (
          menu
        )
      }
      center={
        <div css={[column, mainPadding, { flex: "1 1 auto" }]}>
          <div css={[row, { marginBottom: "20px", alignItems: "flex-end" }]}>
            <h1 css={heading}>{component.name}</h1>
            <div css={[row, { marginLeft: "28px" }]}>
              {isEditing ? (
                <SecondaryButton
                  text="Done"
                  onClick={() => setIsEditing(false)}
                />
              ) : (
                <React.Fragment>
                  <SecondaryButton
                    text="Edit"
                    onClick={() => setIsEditing(true)}
                    margin="0 10px 0 0"
                  />
                  <SecondaryButton text="Delete" onClick={() => {}} />
                </React.Fragment>
              )}
            </div>
          </div>
          <Component component={component} refs={refs} />
        </div>
      }
      right={
        isEditing ? (
          <div
            css={[
              column,
              {
                flexShrink: 0,
                width: "236px",
                minWidth: "236px",
                paddingTop: "8px",
                background: "white",
                height: "100%"
              }
            ]}
          >
            {selectedLayer && (
              <LayerEditor
                layer={selectedLayer}
                refs={refs}
                onChange={updateComponentLayer}
              />
            )}
          </div>
        ) : null
      }
    />
  );
}

export default ComponentView;
