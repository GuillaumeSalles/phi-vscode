/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row } from "../../../styles";
import IconButton from "../../../components/IconButton";
import AddButton from "../../../components/AddButton";
import Button from "../../../components/Button";
import SecondaryButton from "../../../components/SecondaryButton";
import OkCancelModal from "../../../components/OkCancelModal";
import {
  useDialogForm,
  useSelectFormEntry,
  FormSelect
} from "../../../components/Form";
import { Delete, Edit, Link } from "../../../icons";
import React, { useState } from "react";
import uuid from "uuid/v4";
import Section from "./Section";

type Props = {
  component: T.Component;
  layer: T.Layer;
  onOverridesChange: (props: T.Override[]) => void;
};

function makeOverride(
  id: string,
  propId: string,
  layerProp: string
): T.Override {
  return {
    id,
    propId,
    layerProp
  };
}

function add(layer: T.Layer, propId: string, layerProp: string): T.Override[] {
  return [...layer.overrides, makeOverride(uuid(), propId, layerProp)];
}

function edit(
  layer: T.Layer,
  id: string,
  propId: string,
  layerProp: string
): T.Override[] {
  return layer.overrides.map(override =>
    override.id === id ? makeOverride(uuid(), propId, layerProp) : override
  );
}

function remove(layer: T.Layer, id: string): T.Override[] {
  return layer.overrides.filter(item => item.id !== id);
}

function getComponentPropName(component: T.Component, id: string) {
  const prop = component.props.find(prop => prop.id === id);
  if (!prop) {
    throw new Error(
      `Property not found. 
Prop id (${id})
Existing props ids (${component.props.map(prop => prop.id).join(",")}).`
    );
  }
  return prop.name;
}

export type PropOverrideDefinition = {
  name: string;
  allowedPropType: T.ComponentPropType[];
  allowedLayerType: T.LayerType[];
};

export const propsOverrideDefinitions: PropOverrideDefinition[] = [
  {
    name: "text",
    allowedPropType: ["text"],
    allowedLayerType: ["text", "link"]
  },
  {
    name: "href",
    allowedPropType: ["text"],
    allowedLayerType: ["link"]
  },
  {
    name: "children",
    allowedPropType: ["layer"],
    allowedLayerType: ["container"]
  }
];

function getPropertiesNames(layerType: T.LayerType) {
  return propsOverrideDefinitions
    .filter(propDef => propDef.allowedLayerType.includes(layerType))
    .map(propDef => propDef.name);
}

function makeLayerPropsOptions(layer: T.Layer): [string, string][] {
  return getPropertiesNames(layer.type).map(prop => [prop, prop]);
}

function validateLayerProp(layerProp: string | undefined) {
  if (layerProp == null) {
    return "Layer is required";
  }
}

function validateComponentProp(
  component: T.Component,
  layerProp: string | undefined,
  componentPropId: string | undefined
) {
  if (layerProp == null) {
    return; // Validation is handled on layerPropEntry
  }

  if (componentPropId == null) {
    return "Component property is required";
  }

  const property = component.props.find(prop => prop.id === componentPropId);

  if (property == null) {
    throw new Error("Invalid component prop id");
  }

  const propDefinition = propsOverrideDefinitions.find(
    def => def.name === layerProp
  );
  if (propDefinition == null) {
    throw new Error("Invalid prop name");
  }

  if (!propDefinition.allowedPropType.includes(property.type)) {
    return `Layer property "${layerProp}" can't be overrided with ${
      property.name
    }`;
  }
}

const labelsStyle = {
  fontSize: "12px",
  marginTop: "8px"
};

export default function HtmlLayerOverrides({
  layer,
  component,
  onOverridesChange
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const layerPropEntry = useSelectFormEntry("text", str =>
    validateLayerProp(str)
  );
  const layersPropsOptions = makeLayerPropsOptions(layer);

  const propIdEntry = useSelectFormEntry(undefined, propId =>
    validateComponentProp(component, layerPropEntry.value, propId)
  );
  const propsOptions = component.props.map(prop => [prop.id, prop.name]) as [
    string,
    string
  ][];

  const createOrUpdateDialog = useDialogForm(
    [layerPropEntry, propIdEntry],
    () => {
      if (selectedId == null) {
        onOverridesChange(
          add(layer, propIdEntry.value!, layerPropEntry.value!)
        );
      } else {
        onOverridesChange(
          edit(layer, selectedId, propIdEntry.value!, layerPropEntry.value!)
        );
      }
    }
  );
  return (
    <Section
      title="Overrides"
      topRightButton={
        <AddButton
          disabled={component.props.length === 0}
          onClick={() => {
            setSelectedId(null);
            createOrUpdateDialog.open();
            propIdEntry.setValue(component.props[0].id);
          }}
        />
      }
    >
      <OkCancelModal
        title="Override a layer property with a component property"
        {...createOrUpdateDialog.dialogProps}
        buttons={
          <React.Fragment>
            <SecondaryButton
              text="Cancel"
              {...createOrUpdateDialog.cancelButtonProps}
            />
            <Button text="Save" {...createOrUpdateDialog.okButtonProps} />
          </React.Fragment>
        }
        form={
          <>
            <div>
              <span css={labelsStyle}>Property to override</span>
              <div css={row}>
                <FormSelect
                  placeholder="Layer"
                  options={layersPropsOptions}
                  {...layerPropEntry.inputProps}
                />
              </div>
              <span css={labelsStyle}>Component property</span>
              <div css={row}>
                <FormSelect
                  placeholder="Component property"
                  options={propsOptions}
                  {...propIdEntry.inputProps}
                />
              </div>
            </div>
          </>
        }
      />
      {layer.overrides.length === 0 && (
        <span css={{ fontSize: "12px", color: "#999", padding: "8px" }}>
          Bind component props to layer props
        </span>
      )}
      {layer.overrides.map(override => {
        return (
          <div
            key={override.id}
            css={[
              row,
              {
                padding: "4px 8px",
                alignItems: "center",
                fontSize: "14px",
                ":hover button": {
                  display: "block"
                }
              }
            ]}
          >
            <div
              css={[
                row,
                {
                  flex: "1 1 auto",
                  height: "28px",
                  alignItems: "center"
                }
              ]}
            >
              <span>{override.layerProp}</span>
              <span css={{ margin: "6px 8px 0 8px" }}>
                <Link height={20} width={20} />
              </span>
              <span>{getComponentPropName(component, override.propId)}</span>
            </div>
            <IconButton
              cssOverrides={{ display: "none", flex: "0 0 auto" }}
              icon={<Edit height={20} width={20} />}
              onClick={e => {
                e.stopPropagation();
                setSelectedId(override.id);
                createOrUpdateDialog.open();
                propIdEntry.setValue(override.propId);
              }}
            />
            <IconButton
              cssOverrides={{ display: "none", flex: "0 0 auto" }}
              icon={<Delete height={20} width={20} />}
              onClick={e => {
                e.stopPropagation();
                onOverridesChange(remove(layer, override.id));
              }}
            />
          </div>
        );
      })}
    </Section>
  );
}
