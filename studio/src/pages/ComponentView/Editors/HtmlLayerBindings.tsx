/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import Section from "./Section";
import { assertUnreachable } from "../../../utils";
import Field from "../../../components/Field";
import Select from "../../../components/Select";

type Props = {
  component: T.Component;
  bindings: T.Bindings;
  onChange: (bindings: T.Bindings) => void;
  layerType: T.LayerType;
};

function getPropertiesNames(type: T.LayerType) {
  switch (type) {
    case "text":
      return ["content"];
    case "image":
      return ["src", "alt", "height", "width"];
    case "link":
      return ["content", "href"];
    case "container":
    case "component":
      return [];
  }
  assertUnreachable(type);
}

export default function HtmlLayerBindings({
  layerType,
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
      {getPropertiesNames(layerType).map(prop => {
        return (
          <Field key={prop} label={prop}>
            <Select
              value={bindings[prop] == null ? "none" : bindings[prop].propId}
              onChange={propId => {
                if (propId === "none") {
                  const { [prop]: unusedValue, ...newBinding } = bindings;
                  onChange(newBinding);
                } else {
                  onChange({ ...bindings, [prop]: { propId } });
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
