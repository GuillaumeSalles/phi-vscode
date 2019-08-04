/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";
import * as T from "../../../types";
import Field from "../../../components/Field";
import Select from "../../../components/Select";
import { listToEntries, assertUnreachable } from "../../../utils";
import TextAreaInput from "../../../components/TextAreaInput";
import TextInput from "../../../components/TextInput";
import Section from "./Section";
import HtmlLayerOverrides from "./HtmlLayerOverrides";

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

export default function HtmlEditor(props: {
  component: T.Component;
  layer: T.Layer;
  onChange: (layer: T.Layer) => void;
}) {
  const { layer, onChange, component } = props;

  function updateLayer<TLayer>(newProps: Partial<TLayer>) {
    onChange({ ...layer, ...newProps });
  }

  switch (props.layer.type) {
    case "text":
      return (
        <React.Fragment>
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
                placeholder="Text"
                value={props.layer.text}
                onChange={text => updateLayer({ text })}
              />
            </Field>
          </Section>
          <HtmlLayerOverrides
            component={component}
            layer={layer}
            onOverridesChange={overrides => updateLayer({ overrides })}
          />
        </React.Fragment>
      );
    case "container":
      return null;
    case "link":
      return (
        <React.Fragment>
          <Section title="Default Props">
            <Field label="text">
              <TextInput
                cssOverrides={{ width: "100%" }}
                value={props.layer.text}
                onChange={text => updateLayer({ text })}
              />
            </Field>
            <Field label="href">
              <TextInput
                cssOverrides={{ width: "100%" }}
                value={props.layer.href}
                onChange={href => updateLayer({ href })}
              />
            </Field>
          </Section>
          <HtmlLayerOverrides
            component={component}
            layer={layer}
            onOverridesChange={overrides => updateLayer({ overrides })}
          />
        </React.Fragment>
      );
    case "image":
      return (
        <React.Fragment>
          <Section title="Default Props">
            <Field label="src">
              <TextInput
                cssOverrides={{ width: "100%" }}
                value={props.layer.src}
                onChange={src => updateLayer({ src })}
              />
            </Field>
            <Field label="height">
              <TextInput
                cssOverrides={{ width: "100%" }}
                value={props.layer.height}
                onChange={height => updateLayer({ height })}
              />
            </Field>
            <Field label="width">
              <TextInput
                cssOverrides={{ width: "100%" }}
                value={props.layer.width}
                onChange={width => updateLayer({ width })}
              />
            </Field>
            <Field label="alt">
              <TextInput
                cssOverrides={{ width: "100%" }}
                value={props.layer.alt}
                onChange={alt => updateLayer({ alt })}
              />
            </Field>
          </Section>
          <HtmlLayerOverrides
            component={component}
            layer={layer}
            onOverridesChange={overrides => updateLayer({ overrides })}
          />
        </React.Fragment>
      );
  }
}
