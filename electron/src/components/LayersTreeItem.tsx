/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../types";
import { row, colors } from "../styles";
import IconButton from "./IconButton";
import { Delete, Edit } from "../icons";
import { layerTypeToIcon } from "./LayersTree";

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
  onMouseOver: (layer: T.Layer) => void;
};

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
  onDelete,
  onMouseOver
}: Props) {
  return (
    <div
      draggable={draggable}
      onDragStart={() => onDragStart(index)}
      onDragEnd={() => onDragEnd(undefined)}
      onClick={() => onClick(layer.id)}
      onMouseOver={() => onMouseOver(layer)}
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
      <div css={{ flex: "0", height: "24px" }}>
        {layerTypeToIcon(layer.type)}
      </div>
      <span
        css={{
          flex: "1 1 auto",
          marginLeft: "4px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}
      >
        {layer.name}
      </span>
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
