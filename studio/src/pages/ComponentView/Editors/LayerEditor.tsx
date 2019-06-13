/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import ContainerLayerEditor from "./ContainerLayerEditor";
import TextLayerEditor from "./TextLayerEditor";

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
    default:
      throw new Error("Unsupported layer type");
  }
}
