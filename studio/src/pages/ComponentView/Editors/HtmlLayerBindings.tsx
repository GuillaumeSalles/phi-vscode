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
  bindings: T.Bindings;
  onChange: (bindings: T.Bindings) => void;
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
      const component = getComponentOrThrow(layer, refs);
      return component.props.map(prop => prop.name);
  }
  assertUnreachable(layer);
}

export default function HtmlLayerBindings({
  layer,
  refs,
  bindings,
  onChange,
  component
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
        return (
          <Field key={prop} label={prop}>
            <Select
              value={bindings[prop] == null ? "none" : bindings[prop].propName}
              onChange={propName => {
                if (propName === "none") {
                  const { [prop]: unusedValue, ...newBinding } = bindings;
                  onChange(newBinding);
                } else {
                  onChange({ ...bindings, [prop]: { propName } });
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
