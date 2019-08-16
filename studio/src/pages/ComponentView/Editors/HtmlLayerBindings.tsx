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

function propNamesToHtmlProps(names: string[]) {
  return names.map(prop => ({ name: prop, id: prop }));
}

function getPropertiesNames(
  layer: T.Layer,
  refs: T.Refs
): Array<{ id: string; name: string }> {
  switch (layer.type) {
    case "text":
      return propNamesToHtmlProps(["content"]);
    case "image":
      return propNamesToHtmlProps(["src", "alt", "height", "width"]);
    case "link":
      return propNamesToHtmlProps(["content", "href"]);
    case "container":
      return [];
    case "component":
      const component = getComponentOrThrow(layer, refs);
      return component.props.map(prop => ({ id: prop.id, name: prop.name }));
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
    .map(prop => [prop.id, prop.name])
    .concat([["none", "none"]]) as [string, string][];

  return (
    <Section title="Bindings">
      <span css={{ fontSize: "12px", color: "#999", padding: "8px" }}>
        Override layers props with component props
      </span>
      {getPropertiesNames(layer, refs).map(prop => {
        return (
          <Field key={prop.id} label={prop.name}>
            <Select
              value={
                bindings[prop.id] == null ? "none" : bindings[prop.id].propId
              }
              onChange={propId => {
                if (propId === "none") {
                  const { [prop.id]: unusedValue, ...newBinding } = bindings;
                  onChange(newBinding);
                } else {
                  onChange({ ...bindings, [prop.id]: { propId } });
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
