/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import { useRef, Fragment } from "react";

type Props = {
  layerId?: string;
  domRefs: Map<string, HTMLBaseElement>;
};

const selectedLayerLines = "dashed 1px rgb(0,110,197)";

export function Overlay({ layerId, domRefs }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  let domRefRect = layerId
    ? domRefs.get(layerId)?.getBoundingClientRect()
    : undefined;
  const overlayRect = ref.current?.getBoundingClientRect();

  if (layerId) {
    const htmlLayer = domRefs.get(layerId);
    if (htmlLayer) {
      console.log(htmlLayer.getBoundingClientRect());
    }
  }

  return (
    <div
      ref={ref}
      css={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {domRefRect && overlayRect && (
        <Fragment>
          {/* Height */}
          <div
            css={{
              position: "absolute",
              top: domRefRect.top - overlayRect.top,
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
              top: domRefRect.top - overlayRect.top + domRefRect.height,
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
              left: domRefRect.left - overlayRect.left,
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
              left: domRefRect.left - overlayRect.left + domRefRect.width,
              width: "1px",
              borderRight: selectedLayerLines
            }}
          />
          <div
            css={{
              position: "absolute",
              background: "#0000FF22",
              top: domRefRect.top - overlayRect.top,
              left: domRefRect.left - overlayRect.left,
              width: domRefRect.width,
              height: domRefRect.height
            }}
          ></div>
        </Fragment>
      )}
    </div>
  );
}
