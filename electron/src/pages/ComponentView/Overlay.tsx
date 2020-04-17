/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as T from "../../types";
import { Fragment } from "react";
import { uiStateComponentOrThrow } from "../../refsUtil";
import { isResizable } from "../../layerUtils";
import { round } from "../../utils";

type Props = {
  refs: T.Refs;
  layer?: T.Layer;
  containerRect?: DOMRect;
  domRefs: Map<string, HTMLBaseElement>;
  applyAction: T.ApplyAction;
};

const color = "rgb(0,110,197)";
const selectedLayerLines = `dashed 1px ${color}`;
const rulerWidth = "2px";

const anchorStyle = css({
  position: "absolute",
  width: "8px",
  height: "8px",
  background: "white",
  border: `solid 1px ${color}`,
});

export function Overlay({
  refs,
  domRefs,
  containerRect,
  applyAction,
  layer,
}: Props) {
  const uiState = uiStateComponentOrThrow(refs);

  const selectedLayerRect = uiState.layerId
    ? domRefs.get(uiState.layerId)?.getBoundingClientRect()
    : undefined;

  const hoveredLayerRect = uiState.hoveredLayerId
    ? domRefs.get(uiState.hoveredLayerId)?.getBoundingClientRect()
    : undefined;
  const overlayRect = containerRect;

  function onAnchorMouseDown(
    e: React.MouseEvent,
    direction: T.ResizeLayerDirection
  ) {
    let initialX = e.clientX;
    let initialY = e.clientY;

    function onMouseMove(e: MouseEvent) {
      applyAction({
        type: "resizeLayer",
        canvasSize: {
          height: selectedLayerRect!.height,
          width: selectedLayerRect!.width,
        },
        offset: {
          x: e.clientX - initialX,
          y: e.clientY - initialY,
        },
        direction,
      });
      initialX = e.clientX;
      initialY = e.clientY;
    }

    function onMouseUp(e: MouseEvent) {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    e.preventDefault();
  }

  return (
    <Fragment>
      {hoveredLayerRect && overlayRect && (
        <div
          css={{
            position: "absolute",
            border: "solid 2px rgb(0,110,197)",
            top: hoveredLayerRect.top - overlayRect.top,
            left: hoveredLayerRect.left - overlayRect.left,
            width: hoveredLayerRect.width,
            height: hoveredLayerRect.height,
            pointerEvents: "none",
          }}
        />
      )}
      {selectedLayerRect && overlayRect && (
        <Fragment>
          {/* Ruler-Top */}
          <div
            css={{
              position: "absolute",
              bottom:
                overlayRect.bottom -
                selectedLayerRect.bottom +
                selectedLayerRect.height,
              left: 0,
              right: 0,
              height: rulerWidth,
              borderBottom: selectedLayerLines,
              pointerEvents: "none",
            }}
          />
          {/* Ruler-Bottom */}
          <div
            css={{
              position: "absolute",
              top:
                selectedLayerRect.top -
                overlayRect.top +
                selectedLayerRect.height,
              left: 0,
              right: 0,
              height: rulerWidth,
              borderTop: selectedLayerLines,
              pointerEvents: "none",
            }}
          />
          {/* Ruler-Left */}
          <div
            css={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right:
                overlayRect.right -
                selectedLayerRect.right +
                selectedLayerRect.width,
              width: rulerWidth,
              borderRight: selectedLayerLines,
              pointerEvents: "none",
            }}
          />
          {/* Ruler-Right */}
          <div
            css={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left:
                selectedLayerRect.left -
                overlayRect.left +
                selectedLayerRect.width,
              width: rulerWidth,
              borderLeft: selectedLayerLines,
              pointerEvents: "none",
            }}
          />

          {isResizable(layer) && (
            <Fragment>
              {/* Bottom-Right */}
              <div
                onMouseDown={(e) => onAnchorMouseDown(e, "bottom-right")}
                css={[
                  anchorStyle,
                  {
                    top:
                      selectedLayerRect.top -
                      overlayRect.top +
                      selectedLayerRect.height -
                      4,
                    left:
                      selectedLayerRect.left -
                      overlayRect.left +
                      selectedLayerRect.width -
                      4,
                    cursor: "nwse-resize",
                  },
                ]}
              />

              {/* Right */}
              <div
                onMouseDown={(e) => onAnchorMouseDown(e, "right")}
                css={[
                  anchorStyle,
                  {
                    top:
                      selectedLayerRect.top -
                      overlayRect.top +
                      selectedLayerRect.height / 2 -
                      4,
                    left:
                      selectedLayerRect.left -
                      overlayRect.left +
                      selectedLayerRect.width -
                      4,
                    cursor: "ew-resize",
                  },
                ]}
              />

              {/* Top-Right */}
              <div
                onMouseDown={(e) => onAnchorMouseDown(e, "top-right")}
                css={[
                  anchorStyle,
                  {
                    top: selectedLayerRect.top - overlayRect.top - 4,
                    left:
                      selectedLayerRect.left -
                      overlayRect.left +
                      selectedLayerRect.width -
                      4,
                    cursor: "nesw-resize",
                  },
                ]}
              />

              {/* Top */}
              <div
                onMouseDown={(e) => onAnchorMouseDown(e, "top")}
                css={[
                  anchorStyle,
                  {
                    top: selectedLayerRect.top - overlayRect.top - 4,
                    left:
                      selectedLayerRect.left -
                      overlayRect.left +
                      selectedLayerRect.width / 2 -
                      4,
                    cursor: "ns-resize",
                  },
                ]}
              />

              {/* Top-Left */}
              <div
                onMouseDown={(e) => onAnchorMouseDown(e, "top-left")}
                css={[
                  anchorStyle,
                  {
                    top: selectedLayerRect.top - overlayRect.top - 4,
                    left: selectedLayerRect.left - overlayRect.left - 4,
                    cursor: "nwse-resize",
                  },
                ]}
              />

              {/* Left */}
              <div
                onMouseDown={(e) => onAnchorMouseDown(e, "left")}
                css={[
                  anchorStyle,
                  {
                    top:
                      selectedLayerRect.top -
                      overlayRect.top +
                      selectedLayerRect.height / 2 -
                      4,
                    left: selectedLayerRect.left - overlayRect.left - 4,
                    cursor: "ew-resize",
                  },
                ]}
              />

              {/* Bottom-Left */}
              <div
                onMouseDown={(e) => onAnchorMouseDown(e, "bottom-left")}
                css={[
                  anchorStyle,
                  {
                    top:
                      selectedLayerRect.top -
                      overlayRect.top +
                      selectedLayerRect.height -
                      4,
                    left: selectedLayerRect.left - overlayRect.left - 4,
                    cursor: "nesw-resize",
                  },
                ]}
              />

              {/* Bottom */}
              <div
                onMouseDown={(e) => onAnchorMouseDown(e, "bottom")}
                css={[
                  anchorStyle,
                  {
                    top:
                      selectedLayerRect.top -
                      overlayRect.top +
                      selectedLayerRect.height -
                      4,
                    left:
                      selectedLayerRect.left -
                      overlayRect.left +
                      selectedLayerRect.width / 2 -
                      4,
                    cursor: "ns-resize",
                  },
                ]}
              />
            </Fragment>
          )}

          <div
            css={{
              position: "absolute",
              top:
                selectedLayerRect.top -
                overlayRect.top +
                selectedLayerRect.height +
                4 /* Offset to make it prettier */,
              left: selectedLayerRect.left - overlayRect.left - 50,
              width: selectedLayerRect.width + 100,
              color,
              fontSize: "12px",
              fontWeight: 500,
              paddingTop: "4px",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            <span
              css={{
                padding: "2px 4px",
                background: color,
                color: "white",
                borderRadius: "2px",
              }}
            >
              {round(selectedLayerRect.width)} x{" "}
              {round(selectedLayerRect.height)}
            </span>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}
