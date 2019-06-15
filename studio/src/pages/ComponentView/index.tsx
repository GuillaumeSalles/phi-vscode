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
import Menu from "../../components/Menu";
import { Layout } from "../../components/Layout";
import TopBar from "../../components/TopBar";

type Props = {
  components: T.ComponentMap;
  component: T.Component;
  onComponentChange: (component: T.Component) => void;
  refs: T.Refs;
};

function ComponentView({
  components,
  component,
  onComponentChange,
  refs
}: Props) {
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

  function updateLayer(rootLayer: T.Layer, newLayer: T.Layer): T.Layer {
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
            root={component.layout}
            onSelectLayer={() => {}}
            selectedLayer={component.layout}
          />
        ) : (
          <Menu components={components} />
        )
      }
      center={
        <div css={[column, mainPadding, { flex: "1 1 auto" }]}>
          <div css={[row, { marginBottom: "20px", alignItems: "flex-end" }]}>
            <h1 css={heading}>{component.name}</h1>
            <div css={[row, { marginLeft: "28px" }]}>
              {isEditing ? (
                <SecondaryButton
                  text="Save"
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
                bottom: 0,
                paddingTop: "8px",
                background: "white"
              }
            ]}
          >
            <LayerEditor
              layer={component.layout}
              refs={refs}
              onChange={updateComponentLayer}
            />
          </div>
        ) : null
      }
    />
  );
}

export default ComponentView;
