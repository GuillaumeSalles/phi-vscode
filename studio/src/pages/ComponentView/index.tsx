/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import React from "react";
import { column, mainPadding, heading, row, colors } from "../../styles";
import * as T from "../../types";
import Component from "./Component";
import SecondaryButton from "../../components/SecondaryButton";
import { useState } from "react";
import LayersTree from "../../components/LayersTree";
import LayerEditor from "./Editors/LayerEditor";
import HtmlEditor from "./Editors/HtmlEditor";
import { Layout } from "../../components/Layout";
import TopBar from "../../components/TopBar";
import ComponentProps from "./ComponentProps";
import { findLayerById, updateLayer } from "../../layerUtils";
import { useStateWithGetter } from "../../hooks";

const tabStyle = css({
  display: "flex",
  flex: "1 1 auto",
  fontSize: "14px",
  background: "white",
  justifyContent: "center",
  alignItems: "center",
  border: "none",
  cursor: "pointer",
  color: "rgb(136, 136, 136)",
  ":focus": {
    outline: "none",
    background: "#F6F6F6"
  }
});

const selectedTabStyle = css(tabStyle, {
  borderBottom: `solid 2px ${colors.primary}`,
  color: "black"
});

type Props = {
  menu: React.ReactNode;
  componentId: string;
  onComponentChange: (id: string, component: T.Component) => void;
  onDelete: (id: string) => void;
  refs: T.Refs;
};

function ComponentView({
  menu,
  componentId,
  onComponentChange,
  refs,
  onDelete
}: Props) {
  const component = refs.components.get(componentId)!;
  const [layerId, setLayerId] = useStateWithGetter<string | undefined>(() =>
    component.layout ? component.layout.id : undefined
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingHTML, setIsEditingHTML] = useState(true);
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
    onComponentChange(componentId, newComponent);
  }

  function updateComponentRootLayer(newLayer: T.Layer | undefined) {
    const newComponent = {
      ...component,
      layout: newLayer
    };
    setLayerId(newLayer ? newLayer.id : undefined);
    onComponentChange(componentId, newComponent);
  }

  return (
    <Layout
      topBar={<TopBar fileName={refs.fileName} isSaved={refs.isSaved} />}
      left={
        isEditing ? (
          <>
            <LayersTree
              root={component.layout}
              onSelectLayer={setLayerId}
              selectedLayerId={layerId}
              onLayerChange={updateComponentRootLayer}
              refs={refs}
            />
            <ComponentProps
              component={component}
              onComponentChange={newComponent =>
                onComponentChange(componentId, newComponent)
              }
            />
          </>
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
                  <SecondaryButton
                    text="Delete"
                    onClick={() => onDelete(componentId)}
                  />
                </React.Fragment>
              )}
            </div>
          </div>
          <Component component={component} refs={refs} />
        </div>
      }
      right={
        isEditing && selectedLayer ? (
          <div
            css={[
              column,
              {
                flexShrink: 0,
                width: "268px",
                minWidth: "268px",
                background: colors.sideBarBackground,
                height: "100%"
              }
            ]}
          >
            <div
              css={[
                row,
                {
                  flex: "0 0 auto",
                  height: "40px",
                  alignItems: "stretch",
                  borderBottom: "solid 1px #DDD"
                }
              ]}
            >
              <button
                css={isEditingHTML ? selectedTabStyle : tabStyle}
                onClick={() => setIsEditingHTML(true)}
              >
                HTML
              </button>
              <button
                css={isEditingHTML ? tabStyle : selectedTabStyle}
                onClick={() => setIsEditingHTML(false)}
              >
                CSS
              </button>
            </div>
            {isEditingHTML ? (
              <HtmlEditor
                component={component}
                layer={selectedLayer}
                onChange={updateComponentLayer}
                refs={refs}
              />
            ) : (
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
