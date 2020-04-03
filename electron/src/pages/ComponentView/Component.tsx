/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import Layer from "./Layer";
import { column, row } from "../../styles";
import { useState, useCallback, useRef } from "react";
import { Overlay } from "./Overlay";
import { del, set } from "../../helpers/immutable-map";

type Props = {
  component: T.Component;
  refs: T.Refs;
  applyAction: T.ApplyAction;
};

type ComponentExampleViewerProps = {
  example: T.ComponentExample;
  artboard: T.ArtboardDefinition;
  component: T.Component;
  refs: T.Refs;
  applyAction: T.ApplyAction;
};

function ComponentExampleViewer({
  component,
  refs,
  example,
  artboard,
  applyAction,
}: ComponentExampleViewerProps) {
  /**
   * Original idea from sebmarkbage https://github.com/facebook/react/issues/14072#issuecomment-446777406
   */
  // let domRefs = useRef<Map<string, HTMLBaseElement>>(new Map()).current;
  // const refCallback = (id: string, element: HTMLBaseElement | null) => {
  //   element === null ? domRefs.delete(id) : domRefs.set(id, element);
  // };

  let containerRef = useRef<HTMLDivElement>(null);

  let [domRefs, setDomRefs] = useState<Map<string, HTMLBaseElement>>(new Map());
  const refCallback = useCallback(
    (id: string, element: HTMLBaseElement | null) => {
      setDomRefs((previousDomRefs) =>
        element === null
          ? del(previousDomRefs, id)
          : set(previousDomRefs, id, element)
      );
    },
    []
  );

  return (
    <div key={example.id} css={[column, { marginRight: "48px" }]}>
      <h3
        css={{
          color: "rgb(153, 153, 153)",
          fontSize: "12px",
          margin: "0 0 4px 0",
          fontWeight: 400,
        }}
      >
        {artboard.name} - {artboard.width}
      </h3>
      <div
        ref={containerRef}
        onMouseLeave={(event) => {
          applyAction({ type: "hoverLayer" });
        }}
        onMouseOver={(event) => {
          const layerId = (event.target as HTMLBaseElement).getAttribute(
            "layer-id"
          );
          if (layerId) {
            applyAction({ type: "hoverLayer", layerId });
          }
        }}
        onMouseDown={(event) => {
          const layerId = (event.target as HTMLBaseElement).getAttribute(
            "layer-id"
          );
          if (layerId) {
            applyAction({ type: "selectLayer", layerId });
          }
        }}
        css={[
          {
            position: "relative",
            border: "none",
            background: artboard.backgroundColor,
            width: artboard.width,
            height: artboard.height,
            overflow: "hidden",
          },
        ]}
      >
        {component.layout && (
          <Layer
            key={component.layout.id}
            layer={component.layout}
            refs={refs}
            width={parseInt(artboard.width.slice(0, -2))}
            props={example.props}
            refCallback={refCallback}
          />
        )}
        <Overlay
          domRefs={domRefs}
          refs={refs}
          containerRect={containerRef.current?.getBoundingClientRect()}
          applyAction={applyAction}
        />
      </div>
    </div>
  );
}

function Component({ component, refs, applyAction }: Props) {
  return (
    <div css={column}>
      {Array.from(refs.artboards.entries()).map((entry) => (
        <div key={entry[0]} css={[column, { margin: "12px 0" }]}>
          <div css={[row]}>
            {[{ id: "default", name: "Default", props: {} }]
              .concat(component.examples)
              .map((example) => {
                return (
                  <ComponentExampleViewer
                    key={example.id}
                    component={component}
                    refs={refs}
                    example={example}
                    artboard={entry[1]}
                    applyAction={applyAction}
                  />
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Component;
