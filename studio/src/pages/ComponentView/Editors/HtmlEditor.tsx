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
  component: T.Component;
  layer: T.Layer;
  onChange: (layer: T.Layer) => void;
  refs: T.Refs;
};

export default function HtmlEditor(props: Props) {
  const { layer, onChange, refs } = props;

  function updateLayer<TLayer>(newProps: Partial<TLayer>) {
    onChange({ ...layer, ...newProps });
  }

  switch (props.layer.type) {
    case "text":
      const textProps = props.layer.props;
      const updateProps = (newProps: Partial<T.TextLayerProps>) => {
        updateLayer({ props: { ...textProps, ...newProps } });
      };
      return (
        <Section title="Default Props">
          <Field label="Tag">
            <Select
              value={props.layer.tag}
              onChange={tag => updateLayer({ tag })}
              options={textTagsOptions}
            />
          </Field>
          <Field label="Content">
            <TextAreaInput
              placeholder="content"
              value={textProps.content}
              onChange={content => updateProps({ content })}
            />
          </Field>
        </Section>
      );
    case "container":
      return null;
    case "component":
      const refComponent = getComponentOrThrow(props.layer.id, refs);
      const layerProps = props.layer.props;
      return (
        <Section title="Default Props">
          {refComponent.props.map(prop => {
            return (
              <Field key={prop.name} label={prop.name}>
                <TextInput
                  cssOverrides={{ width: "100%" }}
                  value={
                    layerProps[prop.name] == null ? "" : layerProps[prop.name]
                  }
                  onChange={value =>
                    updateLayer({
                      props: { ...layerProps, [prop.name]: value }
                    })
                  }
                />
              </Field>
            );
          })}
        </Section>
      );
    case "link":
      const linkProps = props.layer.props;
      const updateLinkProps = (newProps: Partial<T.LinkLayerProps>) => {
        updateLayer({ props: { ...linkProps, ...newProps } });
      };
      return (
        <Section title="Default Props">
          <Field label="content">
            <TextInput
              cssOverrides={{ width: "100%" }}
              value={linkProps.content}
              onChange={content => updateLinkProps({ content })}
            />
          </Field>
          <Field label="href">
            <TextInput
              cssOverrides={{ width: "100%" }}
              value={linkProps.href}
              onChange={href => updateLinkProps({ href })}
            />
          </Field>
        </Section>
      );
    case "image": {
      const imageProps = props.layer.props;
      const updateProps = (newProps: Partial<T.ImageProps>) => {
        updateLayer({ props: { ...imageProps, ...newProps } });
      };
      return (
        <Section title="Default Props">
          <Field label="src">
            <TextInput
              cssOverrides={{ width: "100%" }}
              value={imageProps.src}
              onChange={src => updateProps({ src })}
            />
          </Field>
          <Field label="height">
            <TextInput
              cssOverrides={{ width: "100%" }}
              value={imageProps.height}
              onChange={height => updateProps({ height })}
            />
          </Field>
          <Field label="width">
            <TextInput
              cssOverrides={{ width: "100%" }}
              value={imageProps.width}
              onChange={width => updateProps({ width })}
            />
          </Field>
          <Field label="alt">
            <TextInput
              cssOverrides={{ width: "100%" }}
              value={imageProps.alt}
              onChange={alt => updateProps({ alt })}
            />
          </Field>
        </Section>
      );
    }
  }
}
