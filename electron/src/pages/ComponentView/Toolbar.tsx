/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import { colors, row, column } from "../../styles";
import { Text, Container, Image, Link, Component } from "../../icons";
import { uiStateComponentOrThrow } from "../../refsUtil";
import uuid from "uuid";
import { useToggle } from "../../hooks";
import { useRef } from "react";
import Popover from "../../components/Popover";
import { getComponentOrThrow } from "../../layerUtils";

type Props = {
  applyAction: T.ApplyAction;
  refs: T.Refs;
};

export default function Toolbar({ applyAction, refs }: Props) {
  const uiState = uiStateComponentOrThrow(refs);
  const rootLayer = getComponentOrThrow(uiState.componentId, refs).layout;
  const disabled =
    rootLayer != null &&
    rootLayer.type !== "container" &&
    rootLayer.type !== "link";

  const popover = useToggle(false);
  const ref = useRef<HTMLDivElement>(null);

  function addLayer(layerType: T.LayerType, layerComponentId?: string) {
    applyAction({
      type: "addLayer",
      layerType: layerType,
      parentLayerId: uiState.layerId,
      componentId: uiState.componentId,
      layerId: uuid(),
      layerComponentId
    });
  }

  return (
    <div
      css={[
        row,
        {
          height: "40px",
          background: colors.topBarBackground
        }
      ]}
    >
      <ToolbarItem disabled={disabled} onClick={() => addLayer("text")}>
        <Text height={20} width={20} opacity={disabled ? 0.7 : 1} />
      </ToolbarItem>
      <ToolbarItem disabled={disabled} onClick={() => addLayer("container")}>
        <Container height={20} width={20} opacity={disabled ? 0.7 : 1} />
      </ToolbarItem>
      <ToolbarItem disabled={disabled} onClick={() => addLayer("image")}>
        <Image height={20} width={20} opacity={disabled ? 0.7 : 1} />
      </ToolbarItem>
      <ToolbarItem disabled={disabled} onClick={() => addLayer("link")}>
        <Link height={20} width={20} opacity={disabled ? 0.7 : 1} />
      </ToolbarItem>
      <div ref={ref}>
        <ToolbarItem disabled={disabled} onClick={popover.activate}>
          <Component height={20} width={20} opacity={disabled ? 0.7 : 1} />
        </ToolbarItem>
        <Popover
          anchor={ref}
          isOpen={popover.isActive}
          onDismiss={popover.deactivate}
          position="bottom"
        >
          <div
            css={[
              column,
              {
                background: colors.topBarBackground
              }
            ]}
          >
            {Array.from(refs.components).map(entry => {
              return (
                <button
                  key={entry[0]}
                  css={[
                    row,
                    {
                      alignItems: "center",
                      padding: "8px 16px",
                      border: "none",
                      width: "100%",
                      fontSize: "14px",
                      background: "transparent",
                      cursor: "pointer",
                      color: colors.sideBarForeground,
                      ":hover:enabled": {
                        backgroundColor: colors.listHoverBackground
                      }
                    }
                  ]}
                  onClick={() => addLayer("component", entry[0])}
                >
                  {entry[1].name}
                </button>
              );
            })}
          </div>
        </Popover>
      </div>
    </div>
  );
}

type ToolbarItemProps = {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
};

function ToolbarItem({ children, onClick, disabled }: ToolbarItemProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      css={{
        height: "40px",
        width: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        color: colors.sideBarForeground
      }}
    >
      {children}
    </button>
  );
}
