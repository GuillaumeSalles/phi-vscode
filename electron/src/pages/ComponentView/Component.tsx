/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import Layer from "./Layer";
import { column, row } from "../../styles";
import { useRef, useState, useCallback } from "react";
import { Overlay } from "./Overlay";
import { del, set } from "../../helpers/immutable-map";

type Props = {
  layerId?: string;
  component: T.Component;
  refs: T.Refs;
};

function ComponentExampleViewer({
  component,
  refs,
  example,
  artboard,
  layerId
}: Props & { example: T.ComponentExample; artboard: T.ArtboardDefinition }) {
  /**
   * Original idea from sebmarkbage https://github.com/facebook/react/issues/14072#issuecomment-446777406
   */
  // let domRefs = useRef<Map<string, HTMLBaseElement>>(new Map()).current;
  // const refCallback = (id: string, element: HTMLBaseElement | null) => {
  //   element === null ? domRefs.delete(id) : domRefs.set(id, element);
  // };

  let [domRefs, setDomRefs] = useState<Map<string, HTMLBaseElement>>(new Map());
  const refCallback = useCallback(
    (id: string, element: HTMLBaseElement | null) => {
      setDomRefs(previousDomRefs =>
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
          fontWeight: 400
        }}
      >
        {artboard.name} - {artboard.width}
      </h3>
      <div
        css={[
          {
            position: "relative",
            border: "none",
            background: artboard.backgroundColor,
            width: artboard.width,
            height: artboard.height
          }
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
        <Overlay domRefs={domRefs} layerId={layerId} />
      </div>
    </div>
  );
}

function Component({ component, refs, layerId }: Props) {
  return (
    <div css={column}>
      {Array.from(refs.artboards.entries()).map(entry => (
        <div key={entry[0]} css={[column, { margin: "12px 0" }]}>
          <div css={[row]}>
            {[{ id: "default", name: "Default", props: {} }]
              .concat(component.examples)
              .map(example => {
                return (
                  <ComponentExampleViewer
                    key={example.id}
                    component={component}
                    layerId={layerId}
                    refs={refs}
                    example={example}
                    artboard={entry[1]}
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
