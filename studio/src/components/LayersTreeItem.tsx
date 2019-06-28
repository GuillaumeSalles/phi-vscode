/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../types";
import { row, colors } from "../styles";
import IconButton from "./IconButton";
import { Delete, Edit } from "../icons";

type Props = {
  index: number;
  layer: T.Layer;
  depth: number;
  draggable: boolean;
  onDragStart: (index: number) => void;
  onDragEnd: (position: undefined) => void;
  onClick: (layerId: string) => void;
  isSelected: boolean;
  onRename: (layer: T.Layer) => void;
  onDelete: (layer: T.Layer) => void;
};

export function layerTypeToIcon(type: T.LayerType) {
  switch (type) {
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

export default function LayersTreeItemComponent({
  index,
  layer,
  depth,
  draggable,
  onDragStart,
  onDragEnd,
  onClick,
  onRename,
  isSelected,
  onDelete
}: Props) {
  return (
    <div
      draggable={draggable}
      onDragStart={() => onDragStart(index)}
      onDragEnd={() => onDragEnd(undefined)}
      onClick={() => onClick(layer.id)}
      css={[
        row,
        {
          paddingLeft: depth * 22 + 22 + "px",
          paddingTop: "2px",
          paddingBottom: "2px",
          paddingRight: "8px",
          borderStyle: "solid",
          borderWidth: "2px",
          borderColor: isSelected ? colors.primary : "transparent",
          alignItems: "center",
          fontSize: "14px",
          ":hover button": {
            display: "block"
          }
        }
      ]}
    >
      {layerTypeToIcon(layer.type)}
      <span css={{ flex: "1 1 auto", marginLeft: "4px" }}>{layer.name}</span>
      <IconButton
        cssOverrides={{ display: "none", flex: "0 0 auto" }}
        icon={<Edit height={20} width={20} />}
        onClick={e => {
          e.stopPropagation();
          onRename(layer);
        }}
      />
      <IconButton
        cssOverrides={{ display: "none", flex: "0 0 auto" }}
        icon={<Delete height={20} width={20} />}
        onClick={e => {
          e.stopPropagation();
          onDelete(layer);
        }}
      />
    </div>
  );
}
