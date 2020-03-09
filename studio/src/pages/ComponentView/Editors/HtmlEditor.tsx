/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import Field from "../../../components/Field";
import Select from "../../../components/Select";
import { listToEntries } from "../../../utils";
import TextAreaInput from "../../../components/TextAreaInput";
import TextInput from "../../../components/TextInput";
import Section from "./Section";
import { getComponentOrThrow } from "../../../layerUtils";

const tags: T.TextLayerTag[] = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span"
];
const textTagsOptions = listToEntries(tags);

type Props = {
  componentId: string;
  component: T.Component;
  layer: T.Layer;
  onChange: (layer: T.Layer) => void;
  refs: T.Refs;
  applyAction: (action: T.Action) => void;
};

export default function HtmlEditor(props: Props) {
  const { layer, onChange, refs, applyAction, componentId } = props;

  function updateLayer<TLayer>(newProps: Partial<TLayer>) {
    onChange({ ...layer, ...newProps });
  }

  function updateLayerProp(name: string, value?: string) {
    applyAction({
      type: "updateLayerProp",
      componentId,
      layerId: layer.id,
      name,
      value
    });
  }

  switch (
    props.layer.type // TODO: Make it generic, switch is not needed anymore
  ) {
    case "text":
      return (
        <Section title="Default Props">
          <Field label="Tag">
            <Select
              value={props.layer.props.tag}
              onChange={tag => updateLayer({ tag })}
              options={textTagsOptions}
            />
          </Field>
          <Field label="Content">
            <TextAreaInput
              placeholder="content"
              value={props.layer.props.content}
              onChange={content => updateLayerProp("content", content)}
            />
          </Field>
        </Section>
      );
    case "container":
      return null;
    case "component":
      const refComponent = getComponentOrThrow(props.layer.id, refs);
      return (
        <Section title="Default Props">
          {refComponent.props.map(prop => {
            return (
              <Field key={prop.name} label={prop.name}>
                <TextInput
                  cssOverrides={{ width: "100%" }}
                  value={
                    props.layer.props[prop.name] == null
                      ? ""
                      : props.layer.props[prop.name]
                  }
                  onChange={value => updateLayerProp(prop.name, value)}
                />
              </Field>
            );
          })}
        </Section>
      );
    case "link":
      return (
        <Section title="Default Props">
          <Field label="content">
            <TextInput
              cssOverrides={{ width: "100%" }}
              value={props.layer.props.content}
              onChange={content => updateLayerProp("content", content)}
            />
          </Field>
          <Field label="href">
            <TextInput
              cssOverrides={{ width: "100%" }}
              value={props.layer.props.href}
              onChange={href => updateLayerProp("href", href)}
            />
          </Field>
        </Section>
      );
    case "image": {
      return (
        <Section title="Default Props">
          <Field label="src">
            <TextInput
              cssOverrides={{ width: "100%" }}
              value={props.layer.props.src}
              onChange={src => updateLayerProp("src", src)}
            />
          </Field>
          <Field label="height">
            <TextInput
              cssOverrides={{ width: "100%" }}
              value={props.layer.props.height}
              onChange={height => updateLayerProp("height", height)}
            />
          </Field>
          <Field label="width">
            <TextInput
              cssOverrides={{ width: "100%" }}
              value={props.layer.props.width}
              onChange={width => updateLayerProp("width", width)}
            />
          </Field>
          <Field label="alt">
            <TextInput
              cssOverrides={{ width: "100%" }}
              value={props.layer.props.alt}
              onChange={alt => updateLayerProp("height", alt)}
            />
          </Field>
        </Section>
      );
    }
  }
}
