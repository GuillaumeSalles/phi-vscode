/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { column, mainPadding, heading, row, colors } from "../../styles";
import * as T from "../../types";
import Component from "./Component";
import { useState } from "react";
import LayersTree from "../../components/LayersTree";
import LayerEditor from "./Editors/LayerEditor";
import HtmlEditor from "./Editors/HtmlEditor";
import { Layout } from "../../components/Layout";
import ComponentProps from "./ComponentProps";
import { findLayerById, updateLayer } from "../../layerUtils";
import HtmlLayerBindings from "./Editors/HtmlLayerBindings";
import ComponentExamplesEditor from "./Editors/ComponentExamplesEditor";
import React from "react";
import { selectLayer } from "../../actions/factories";

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
  componentId: string;
  onComponentChange: (id: string, component: T.Component) => void;
  refs: T.Refs;
  applyAction: (action: T.Action) => void;
};

export default function VsCodeComponent({
  componentId,
  onComponentChange,
  refs,
  applyAction
}: Props) {
  const component = refs.components.get(componentId)!;

  const [isEditingHTML, setIsEditingHTML] = useState(true);
  const selectedLayer =
    component.layout && refs.selectedLayerId
      ? findLayerById(component.layout, refs.selectedLayerId)
      : undefined;

  function updateComponentLayer(newLayer: T.Layer) {
    const newComponent = {
      ...component,
      layout: updateLayer(component.layout, newLayer)
    };
    applyAction(selectLayer(newLayer.id));
    onComponentChange(componentId, newComponent);
  }

  return (
    <Layout
      topBar={null}
      left={
        <React.Fragment>
          <LayersTree
            componentId={componentId}
            root={component.layout}
            refs={refs}
            applyAction={applyAction}
          />
          <ComponentProps
            component={component}
            componentId={componentId}
            applyAction={applyAction}
          />
        </React.Fragment>
      }
      center={
        <div css={[column, { height: "100%", overflowX: "hidden" }]}>
          <div
            css={[column, mainPadding, { flex: "1 1 auto", overflowX: "auto" }]}
          >
            <div
              css={[
                row,
                {
                  marginBottom: "20px",
                  alignItems: "flex-end",
                  minHeight: "32px"
                }
              ]}
            >
              <h1 css={heading}>{component.name}</h1>
            </div>
            <Component component={component} refs={refs} />
          </div>
        </div>
      }
      right={
        selectedLayer ? (
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
              <React.Fragment>
                <HtmlEditor
                  component={component}
                  layer={selectedLayer}
                  onChange={updateComponentLayer}
                  refs={refs}
                />
                <HtmlLayerBindings
                  component={component}
                  layer={selectedLayer}
                  refs={refs}
                  bindings={selectedLayer.bindings}
                  onChange={bindings =>
                    updateComponentLayer({ ...selectedLayer, bindings })
                  }
                />
              </React.Fragment>
            ) : (
              <LayerEditor
                layer={selectedLayer}
                refs={refs}
                onChange={updateComponentLayer}
              />
            )}
          </div>
        ) : (
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
            <ComponentExamplesEditor
              component={component}
              componentId={componentId}
              applyAction={applyAction}
            />
          </div>
        )
      }
    />
  );
}
