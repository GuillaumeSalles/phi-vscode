/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../types";
import { row, column, mainPadding } from "../styles";
import Component from "../Component";
import { useState } from "react";
import ContainerLayerEditor from "../ContainerLayerEditor";
import TextLayerEditor from "../TextLayerEditor";
import LayersTree from "../LayersTree";
import Layout from "../Layout";

type LayerEditorProps = {
  layer: T.Layer;
  onChange: (layer: T.Layer) => void;
  refs: T.Refs;
};

function LayerEditor({ layer, onChange, refs }: LayerEditorProps) {
  switch (layer.type) {
    case "container":
      return (
        <ContainerLayerEditor layer={layer} onChange={onChange} refs={refs} />
      );
    case "text":
      return <TextLayerEditor layer={layer} onChange={onChange} refs={refs} />;
    default:
      throw new Error("Unsupported layer type");
  }
}

type Props = {
  component: T.Component;
  updateComponent: (component: T.Component) => void;
  refs: T.Refs;
};

function ComponentEditor({ component, updateComponent, refs }: Props) {
  const [layer, setLayer] = useState(component.layout);

  function updateComponentLayer(newLayer: T.Layer) {
    const newComponent = {
      ...component,
      layout: updateLayer(component.layout, newLayer)
    };
    setLayer(newLayer);
    updateComponent(newComponent);
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
      left={
        <LayersTree
          selectedLayer={layer}
          root={component.layout}
          onSelectLayer={layer => setLayer(layer)}
        />
      }
    >
      <div css={[row, { height: "100%" }]}>
        <div css={[column, mainPadding, { flex: "1 1 auto" }]}>
          <h1>{component.name}</h1>
          <Component component={component} refs={refs} />
        </div>
        <div
          css={[
            column,
            {
              width: "280px",
              minWidth: "280px",
              borderLeft: "1px solid #eaeaea",
              bottom: 0,
              paddingBottom: "24px",
              paddingLeft: "16px",
              paddingRight: "16px",
              paddingTop: "24px"
            }
          ]}
        >
          <LayerEditor
            layer={layer}
            refs={refs}
            onChange={layer => updateComponentLayer(layer)}
          />
        </div>
      </div>
    </Layout>
  );
}

export default ComponentEditor;
