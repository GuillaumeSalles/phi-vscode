/** @jsx jsx */
import { jsx, InterpolationWithTheme } from "@emotion/core";
import * as T from "../types";
import { column, row, colors, sectionTitle } from "../styles";
import AddLayerPopover from "./AddLayerPopover";
import { useRef, useState, useMemo, useCallback } from "react";
import LayersTreeItemComponent from "./LayersTreeItem";
import { findLayerById, canHaveChildren } from "../layerUtils";
import OkCancelModal from "./OkCancelModal";
import { useStringFormEntry, FormInput, useDialogForm } from "./Form";
import { validateLayerName } from "../validators";
import React from "react";
import Button from "./Button";
import SecondaryButton from "./SecondaryButton";
import { assertUnreachable } from "../utils";
import { Link, Image, Text, Container, Component } from "../icons";
import uuid from "uuid";
import { selectLayer } from "../actions/factories";

type Props = {
  componentId: string;
  root?: T.Layer;
  refs: T.Refs;
  applyAction: (action: T.Action) => void;
};

export type LayersTreeItem = {
  parent?: LayersTreeItem;
  layer: T.Layer;
  depth: number;
};

type DropPosition = {
  index: number;
  depth: number;
};

type InsertPosition = { parentId: string; position: number };

const itemHeight = 32;
const depthOffset = 22;
const leftOffset = 22;

function flatten<T>(arrOfArr: T[][]): T[] {
  const result = [];
  for (let arr of arrOfArr) {
    for (let item of arr) {
      result.push(item);
    }
  }
  return result;
}

export function flattenLayer(
  layer: T.Layer | undefined,
  parent?: LayersTreeItem,
  depth: number = 0
): LayersTreeItem[] {
  if (!layer) {
    return [];
  }
  const item = { parent, layer, depth };
  const results: LayersTreeItem[] = [item];
  if (canHaveChildren(layer)) {
    for (let child of flatten(
      layer.children.map(child => flattenLayer(child, item, depth + 1))
    )) {
      results.push(child);
    }
  }
  return results;
}

type DepthsBoundaries = {
  min: number;
  max: number;
};

export function layerTypeToIcon(type: T.LayerType) {
  switch (type) {
    case "text":
      return <Text height={24} width={24} />;
    case "link":
      return <Link height={24} width={24} />;
    case "container":
      return <Container height={24} width={24} />;
    case "image":
      return <Image height={24} width={24} />;
    case "component":
      return <Component height={24} width={24} />;
  }
  assertUnreachable(type);
}

export function getDepthsBoundaries(
  items: LayersTreeItem[],
  dragIndex: number,
  dropPosition: DropPosition
): DepthsBoundaries {
  const beforeItem = items[dropPosition.index];
  const nextItem = items[dropPosition.index + 1];

  // At this point, if beforeItem is part of the subtree, it should be the last item of the subtree
  if (isPartOfSubtree(beforeItem, items[dragIndex])) {
    return {
      min: nextItem ? nextItem.depth : 1,
      max: items[dragIndex].depth
    };
  }

  return {
    min: nextItem ? nextItem.depth : 1,
    max: canHaveChildren(beforeItem.layer)
      ? beforeItem.depth + 1
      : beforeItem.depth
  };
}

export function getDragIndicatorLeft(
  items: LayersTreeItem[],
  dragIndex: number,
  dropPosition: DropPosition
) {
  const boundaries = getDepthsBoundaries(items, dragIndex, dropPosition);
  if (dropPosition.depth > boundaries.max) {
    return boundaries.max;
  }
  if (dropPosition.depth < boundaries.min) {
    return boundaries.min;
  }
  return dropPosition.depth;
}

function isPartOfSubtree(child: LayersTreeItem, root: LayersTreeItem) {
  let current = child;
  while (current && current.parent) {
    if (current.parent.layer === root.layer) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

export function isValidDropIndex(
  items: LayersTreeItem[],
  draggedIndex: number,
  index: number
): boolean {
  return (
    index >= 0 &&
    index < items.length &&
    !isPartOfSubtree(items[index + 1], items[draggedIndex])
  );
}

function getDragIndicatorStyle(
  items: LayersTreeItem[],
  draggedIndex?: number,
  dropPosition?: DropPosition
): InterpolationWithTheme<any> {
  if (
    draggedIndex === undefined ||
    dropPosition === undefined ||
    !isValidDropIndex(items, draggedIndex, dropPosition.index)
  ) {
    return {
      display: "none"
    };
  }

  return {
    display: "block",
    position: "absolute",
    top: dropPosition.index * itemHeight + itemHeight,
    left:
      getDragIndicatorLeft(items, draggedIndex, dropPosition) * depthOffset +
      leftOffset,
    right: 0,
    height: "2px",
    background: colors.primary
  };
}

export function findInsertionPosition(
  items: LayersTreeItem[],
  dropPosition: DropPosition
): InsertPosition {
  let position = 0;
  let parent: T.Layer | undefined;

  for (let i = dropPosition.index; i >= 0; i--) {
    const item = items[i];
    if (item.depth === dropPosition.depth) {
      position++;
    }
    if (item.depth === dropPosition.depth - 1) {
      parent = item.layer;
      break;
    }
  }

  if (!parent) {
    throw new Error("Parent not found");
  }

  return {
    parentId: parent.id,
    position
  };
}

function LayersTree({ componentId, root, refs, applyAction }: Props) {
  const [draggedIndex, setDraggedIndex] = useState<number | undefined>();
  const [dragIndicatorPosition, setDragIndicatorPosition] = useState<
    DropPosition | undefined
  >(undefined);
  const layerNameEntry = useStringFormEntry("", value =>
    validateLayerName(value, root)
  );
  const selectedLayer =
    root && refs.selectedLayerId
      ? findLayerById(root, refs.selectedLayerId)
      : undefined;

  const renameDialog = useDialogForm([layerNameEntry], () => {
    applyAction({
      type: "renameLayer",
      layerId: refs.selectedLayerId!,
      componentId,
      name: layerNameEntry.value
    });
  });

  const addLayerCallback = useCallback(
    (layerType: T.LayerType, layerComponentId?: string) => {
      const layerId = uuid();
      applyAction({
        type: "addLayer",
        componentId,
        parentLayerId: refs.selectedLayerId,
        layerComponentId,
        layerType,
        layerId
      });
    },
    [applyAction, refs.selectedLayerId, componentId]
  );

  const onRename = useCallback(
    (layer: T.Layer) => {
      renameDialog.open();
      layerNameEntry.setValue(layer.name);
      applyAction(selectLayer(layer.id));
    },
    [renameDialog, layerNameEntry, applyAction]
  );

  const onDelete = useCallback(
    (layer: T.Layer) => {
      applyAction({ type: "deleteLayer", componentId, layerId: layer.id });
    },
    [applyAction]
  );

  const onLayerClick = useCallback(
    (id: string) => {
      applyAction(selectLayer(id));
    },
    [applyAction]
  );

  const treeViewRef = useRef<HTMLDivElement>(null);
  const flattenLayers = useMemo(() => flattenLayer(root), [root]);

  return (
    <div
      css={[
        column,
        {
          width: "240px"
        }
      ]}
    >
      <div
        css={[
          row,
          { justifyContent: "space-between", margin: "24px 24px 16px 24px" }
        ]}
      >
        <h2 css={sectionTitle}>Layers</h2>
        <AddLayerPopover
          onAdd={addLayerCallback}
          refs={refs}
          disabled={
            selectedLayer !== undefined &&
            selectedLayer.type !== "container" &&
            selectedLayer.type !== "link"
          }
        />
        <OkCancelModal
          title="Rename your layer"
          {...renameDialog.dialogProps}
          buttons={
            <React.Fragment>
              <SecondaryButton
                text="Cancel"
                {...renameDialog.cancelButtonProps}
              />
              <Button text="Rename" {...renameDialog.okButtonProps} />
            </React.Fragment>
          }
          form={
            <FormInput
              placeholder="Name your layer"
              {...layerNameEntry.inputProps}
            />
          }
        />
      </div>
      <div
        ref={treeViewRef}
        css={[column, { position: "relative", height: "100%" }]}
        onDragOver={e => {
          const boundingRect = e.currentTarget.getBoundingClientRect();
          const relativeX = e.pageX - boundingRect.left;
          const relativeY = e.pageY - boundingRect.top;
          const index = Math.min(
            Math.round((relativeY - itemHeight) / itemHeight),
            flattenLayers.length - 1
          );
          const depth = Math.round((relativeX - leftOffset) / depthOffset);
          if (
            dragIndicatorPosition == null ||
            dragIndicatorPosition.index !== index ||
            dragIndicatorPosition.depth !== depth
          ) {
            setDragIndicatorPosition({
              index,
              depth
            });
          }
          e.preventDefault();
          e.dataTransfer.dropEffect = index < 0 ? "none" : "move";
        }}
        onDrop={e => {
          e.preventDefault();
          const { parentId, position } = findInsertionPosition(flattenLayers, {
            index: dragIndicatorPosition!.index,
            depth: getDragIndicatorLeft(
              flattenLayers,
              draggedIndex!,
              dragIndicatorPosition!
            )
          });
          applyAction({
            type: "moveLayer",
            componentId,
            layerId: flattenLayers[draggedIndex!].layer.id,
            parentId,
            position
          });
        }}
      >
        <div
          css={getDragIndicatorStyle(
            flattenLayers,
            draggedIndex,
            dragIndicatorPosition
          )}
        />
        {flattenLayers.map((item, index) => (
          <LayersTreeItemComponent
            key={item.layer.id}
            layer={item.layer}
            depth={item.depth}
            index={index}
            draggable={index !== 0}
            onDragStart={setDraggedIndex}
            onDragEnd={setDragIndicatorPosition}
            onClick={onLayerClick}
            onRename={onRename}
            onDelete={onDelete}
            isSelected={item.layer.id === refs.selectedLayerId}
          />
        ))}
      </div>
    </div>
  );
}

export default LayersTree;
