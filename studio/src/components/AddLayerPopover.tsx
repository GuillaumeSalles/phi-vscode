/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../types";
import { useRef } from "react";
import Popover from "./Popover";
import { card, row } from "../styles";
import { layerTypeToIcon } from "./LayersTree";
import { layerTypes } from "../constants";
import AddButton from "./AddButton";
import { useToggle } from "../hooks";
import { layerTypeToName } from "../layerUtils";

type Props = {
  onAdd: (type: T.LayerType) => void;
  disabled: boolean;
};

export default function AddLayerPopover({ disabled, onAdd }: Props) {
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
                  width: "100%",
                  fontSize: "14px",
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
