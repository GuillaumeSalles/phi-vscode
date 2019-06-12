/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "./types";
import { column, row, leftMenuHeading, colors } from "./styles";

type Props = {
  root: T.Layer;
  onSelectLayer: (layer: T.Layer) => void;
  selectedLayer: T.Layer;
};

type LayersTreeItem = {
  layer: T.Layer;
  depth: number;
};

function flatten<T>(arrOfArr: T[][]): T[] {
  const result = [];
  for (let arr of arrOfArr) {
    for (let item of arr) {
      result.push(item);
    }
  }
  return result;
}

function flattenLayer(layer: T.Layer, depth: number = 0): LayersTreeItem[] {
  const results = [{ layer, depth }];
  if (layer.type === "container") {
    for (let child of flatten(
      layer.children.map(child => flattenLayer(child, depth + 1))
    )) {
      results.push(child);
    }
  }
  return results;
}

function layerToIcon(layer: T.Layer) {
  switch (layer.type) {
    case "text":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path d="M9.17 15.5h5.64l1.14 3h2.09l-5.11-13h-1.86l-5.11 13h2.09l1.12-3zM12 7.98l2.07 5.52H9.93L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16z" />
        </svg>
      );
    case "container":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path d="M21 18H2v2h19v-2zm-2-8v4H4v-4h15m1-2H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zm1-4H2v2h19V4z" />
        </svg>
      );
    default:
      throw new Error("Invalid layer type");
  }
}

function LayersTree({ root, onSelectLayer, selectedLayer }: Props) {
  return (
    <div
      css={[
        column,
        {
          paddingBottom: "24px",
          paddingTop: "24px"
        }
      ]}
    >
      <h2 css={leftMenuHeading}>Layers</h2>
      {flattenLayer(root).map(item => (
        <div
          key={item.layer.id}
          css={[
            row,
            {
              paddingLeft: (item.depth + 1) * 22 + "px",
              paddingTop: "2px",
              paddingBottom: "2px",
              paddingRight: "8px",
              borderStyle: "solid",
              borderWidth: "2px",
              borderColor:
                item.layer === selectedLayer ? colors.primary : "transparent",
              alignItems: "center",
              fontSize: "14px"
            }
          ]}
          onClick={() => onSelectLayer(item.layer)}
        >
          {layerToIcon(item.layer)}
          <span css={{ marginLeft: "4px" }}>{item.layer.name}</span>
        </div>
      ))}
    </div>
  );
}

export default LayersTree;
