/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import { useRef, Fragment } from "react";
import { uiStateComponentOrThrow } from "../../refsUtil";

type Props = {
  refs: T.Refs;
  domRefs: Map<string, HTMLBaseElement>;
};

const selectedLayerLines = "dashed 1px rgb(0,110,197)";

export function Overlay({ refs, domRefs }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const uiState = uiStateComponentOrThrow(refs);

  const selectedLayerRect = uiState.layerId
    ? domRefs.get(uiState.layerId)?.getBoundingClientRect()
    : undefined;

  const hoveredLayerRect = uiState.hoveredLayerId
    ? domRefs.get(uiState.hoveredLayerId)?.getBoundingClientRect()
    : undefined;
  const overlayRect = ref.current?.getBoundingClientRect();

  return (
    <div
      ref={ref}
      css={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none"
      }}
    >
      {hoveredLayerRect && overlayRect && (
        <div
          css={{
            position: "absolute",
            border: "solid 2px rgb(0,110,197)",
            top: hoveredLayerRect.top - overlayRect.top,
            left: hoveredLayerRect.left - overlayRect.left,
            width: hoveredLayerRect.width,
            height: hoveredLayerRect.height
          }}
        />
      )}
      {selectedLayerRect && overlayRect && (
        <Fragment>
          {/* Height */}
          <div
            css={{
              position: "absolute",
              top: selectedLayerRect.top - overlayRect.top,
              left: 0,
              right: 0,
              height: "1px",
              borderTop: selectedLayerLines
            }}
          />
          {/* Bottom */}
          <div
            css={{
              position: "absolute",
              top:
                selectedLayerRect.top -
                overlayRect.top +
                selectedLayerRect.height,
              left: 0,
              right: 0,
              height: "1px",
              borderTop: selectedLayerLines
            }}
          />
          {/* Left */}
          <div
            css={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: selectedLayerRect.left - overlayRect.left,
              width: "1px",
              borderRight: selectedLayerLines
            }}
          />
          {/* Right */}
          <div
            css={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left:
                selectedLayerRect.left -
                overlayRect.left +
                selectedLayerRect.width,
              width: "1px",
              borderRight: selectedLayerLines
            }}
          />
        </Fragment>
      )}
    </div>
  );
}
