/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import ContainerLayerEditor from "./ContainerLayerEditor";
import TextLayerEditor from "./TextLayerEditor";
import LinkLayerEditor from "./LinkLayerEditor";
import { assertUnreachable } from "../../../utils";

type Props = {
  layer: T.Layer;
  onChange: (layer: T.Layer) => void;
  refs: T.Refs;
};

export default function LayerEditor({ layer, onChange, refs }: Props) {
  switch (layer.type) {
    case "container":
      return (
        <ContainerLayerEditor layer={layer} onChange={onChange} refs={refs} />
      );
    case "text":
      return <TextLayerEditor layer={layer} onChange={onChange} refs={refs} />;
    case "link":
      return <LinkLayerEditor layer={layer} onChange={onChange} refs={refs} />;
  }
  assertUnreachable(layer);
}
