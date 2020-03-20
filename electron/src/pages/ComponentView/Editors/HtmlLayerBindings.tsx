/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import Section from "./Section";
import { assertUnreachable } from "../../../utils";
import Field from "../../../components/Field";
import Select from "../../../components/Select";
import { getComponentOrThrow } from "../../../layerUtils";

type Props = {
  component: T.Component;
  componentId: string;
  applyAction: T.ApplyAction;
  bindings: T.Bindings;
  layer: T.Layer;
  refs: T.Refs;
};

function getPropertiesNames(layer: T.Layer, refs: T.Refs): Array<string> {
  switch (layer.type) {
    case "text":
      return ["content"];
    case "image":
      return ["src", "alt", "height", "width"];
    case "link":
      return ["content", "href"];
    case "container":
      return [];
    case "component":
      const component = getComponentOrThrow(layer.componentId, refs);
      return component.props.map(prop => prop.name);
  }
  assertUnreachable(layer);
}

export default function HtmlLayerBindings({
  layer,
  refs,
  bindings,
  component,
  componentId,
  applyAction
}: Props) {
  const options = component.props
    .map(prop => [prop.name, prop.name])
    .concat([["none", "none"]]) as [string, string][];

  return (
    <Section title="Bindings">
      <span css={{ fontSize: "12px", color: "#999", padding: "8px" }}>
        Override layers props with component props
      </span>
      {getPropertiesNames(layer, refs).map(prop => {
        const value = bindings[prop] == null ? "none" : bindings[prop].propName;
        return (
          <Field key={prop} label={prop}>
            <Select
              value={value}
              onChange={propName => {
                if (propName === "none") {
                  applyAction({
                    type: "deleteLayerBinding",
                    componentId,
                    layerId: layer.id,
                    layerProp: prop
                  });
                } else {
                  applyAction({
                    type: "updateLayerBinding",
                    componentId,
                    layerId: layer.id,
                    layerProp: prop,
                    componentProp: propName
                  });
                }
              }}
              options={options}
            />
          </Field>
        );
      })}
    </Section>
  );
}
