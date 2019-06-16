/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../types";
import IconButton from "./IconButton";
import { Add } from "../icons";
import { useRef, useState } from "react";
import Popover from "./Popover";
import { card, row } from "../styles";
import { layerTypeToIcon } from "./LayersTree";
import { layerTypes } from "../constants";

function layerTypeToName(type: T.LayerType): string {
  switch (type) {
    case "text":
      return "Text";
    case "container":
      return "Container";
    default:
      throw new Error("Unkwown layer type");
  }
}

type Props = {
  onAdd: (type: T.LayerType) => void;
  disabled: boolean;
};

export default function AddLayerPopover({ disabled, onAdd }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref}>
      <IconButton
        disabled={disabled}
        icon={<Add color={disabled ? "rgb(204, 204, 204)" : "black"} />}
        onClick={() => setIsOpen(true)}
      />
      <Popover anchor={ref} isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <div css={[card, { margin: "8px 0", width: "240px" }]}>
          {layerTypes.map(type => (
            <button
              key={type}
              onClick={() => onAdd(type)}
              css={[
                row,
                {
                  alignItems: "center",
                  padding: "8px 16px",
                  border: "none",
                  ":hover": {
                    backgroundColor: "#EAEAEA"
                  }
                }
              ]}
            >
              {layerTypeToIcon(type)}
              <span css={{ marginLeft: "8px" }}>{layerTypeToName(type)}</span>
            </button>
          ))}
        </div>
      </Popover>
    </div>
  );
}
