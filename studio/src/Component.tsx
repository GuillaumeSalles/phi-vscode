/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "./types";
import Layer from "./Layer";

type Props = {
  component: T.Component;
  refs: T.Refs;
};

function Component({ component, refs }: Props) {
  return <Layer layer={component.layout} refs={refs} />;
}

export default Component;
