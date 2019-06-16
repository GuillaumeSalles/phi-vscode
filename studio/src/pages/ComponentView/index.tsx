/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import { column, mainPadding, heading, row } from "../../styles";
import * as T from "../../types";
import Component from "./Component";
import SecondaryButton from "../../components/SecondaryButton";
import { useState } from "react";
import LayersTree from "../../components/LayersTree";
import LayerEditor from "./Editors/LayerEditor";
import { Layout } from "../../components/Layout";
import TopBar from "../../components/TopBar";
import { makeTextLayer } from "../../factories";

type Props = {
  menu: React.ReactNode;
  component: T.Component;
  onComponentChange: (component: T.Component) => void;
  refs: T.Refs;
};

function ComponentView({ menu, component, onComponentChange, refs }: Props) {
  const [layer, setLayer] = useState(component.layout);
  const [isEditing, setIsEditing] = useState(false);

  function updateComponentLayer(newLayer: T.Layer) {
    const newComponent = {
      ...component,
      layout: updateLayer(component.layout, newLayer)
    };
    setLayer(newLayer);
    onComponentChange(newComponent);
  }

  function addLayer(type: T.LayerType) {
    updateComponentLayer(makeTextLayer(refs));
  }

  function updateLayer(
    rootLayer: T.Layer | undefined,
    newLayer: T.Layer
  ): T.Layer {
    if (!rootLayer) {
      return newLayer;
    }

    if (rootLayer.id === newLayer.id) {
      return newLayer;
    }

    if (rootLayer.type === "container") {
      return {
        ...rootLayer,
        children: rootLayer.children.map(child => updateLayer(child, newLayer))
      };
    }

    return rootLayer;
  }

  return (
    <Layout
      topBar={<TopBar fileName={refs.fileName} isSaved={refs.isSaved} />}
      left={
        isEditing ? (
          <LayersTree
            onAddLayer={addLayer}
            root={component.layout}
            onSelectLayer={() => {}}
            selectedLayer={component.layout}
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
            {component.layout && (
              <LayerEditor
                layer={component.layout}
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
