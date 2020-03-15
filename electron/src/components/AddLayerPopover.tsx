/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../types";
import { useRef } from "react";
import Popover from "./Popover";
import { card, row, colors } from "../styles";
import { layerTypeToIcon } from "./LayersTree";
import AddButton from "./AddButton";
import { useToggle } from "../hooks";

type Props = {
  onAdd: (layerType: T.LayerType, componentId?: string) => void;
  disabled: boolean;
  refs: T.Refs;
};

export default function AddLayerPopover({ disabled, onAdd, refs }: Props) {
  const popover = useToggle(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref}>
      <AddButton disabled={disabled} onClick={popover.activate} />
      <Popover
        anchor={ref}
        isOpen={popover.isActive}
        onDismiss={popover.deactivate}
        position="bottom"
      >
        <div
          css={[
            {
              boxShadow: "rgba(0, 0, 0, 0.12) 0px 5px 10px 0px",
              background: colors.popupBackground,
              margin: "8px 0",
              width: "240px"
            }
          ]}
        >
          <Item
            name="Container"
            onClick={() => onAdd("container")}
            icon={layerTypeToIcon("container")}
          />
          <Item
            name="Text"
            onClick={() => onAdd("text")}
            icon={layerTypeToIcon("text")}
          />
          <Item
            name="Image"
            onClick={() => onAdd("image")}
            icon={layerTypeToIcon("image")}
          />
          <Item
            name="Link"
            onClick={() => onAdd("link")}
            icon={layerTypeToIcon("link")}
          />
          {Array.from(refs.components).map(entry => {
            return (
              <Item
                key={entry[0]}
                name={entry[1].name}
                onClick={() => onAdd("component", entry[0])}
                icon={layerTypeToIcon("component")}
              />
            );
          })}
        </div>
      </Popover>
    </div>
  );
}

function Item({
  onClick,
  name,
  icon
}: {
  onClick: () => void;
  name: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      key={name}
      onClick={onClick}
      css={[
        row,
        {
          alignItems: "center",
          padding: "8px 16px",
          border: "none",
          width: "100%",
          fontSize: "14px",
          background: "transparent",
          color: colors.sideBarForeground,
          ":hover": {
            backgroundColor: colors.listHoverBackground
          }
        }
      ]}
    >
      {icon}
      <span css={{ marginLeft: "8px" }}>{name}</span>
    </button>
  );
}
