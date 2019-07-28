/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import { column, row, sectionTitle } from "../../styles";
import IconButton from "../../components/IconButton";
import AddButton from "../../components/AddButton";
import Button from "../../components/Button";
import SecondaryButton from "../../components/SecondaryButton";
import OkCancelModal from "../../components/OkCancelModal";
import {
  useDialogForm,
  useSelectFormEntry,
  FormSelect
} from "../../components/Form";
import { Delete, Edit, Link } from "../../icons";
import React, { useState } from "react";
import uuid from "uuid/v4";
import { layerTreeToArray, findLayerById } from "../../layerUtils";

type Props = {
  component: T.Component;
  onOverridesChange: (props: T.Override[]) => void;
};

function makeOverride(id: string, propId: string, layerId: string): T.Override {
  return {
    id,
    propId,
    layerId,
    layerProp: "text"
  };
}

function add(
  component: T.Component,
  propId: string,
  layerId: string
): T.Override[] {
  return [...component.overrides, makeOverride(uuid(), propId, layerId)];
}

function edit(
  component: T.Component,
  id: string,
  propId: string,
  layerId: string
): T.Override[] {
  return component.overrides.map(override =>
    override.id === id ? makeOverride(uuid(), propId, layerId) : override
  );
}

function remove(component: T.Component, id: string): T.Override[] {
  return component.overrides.filter(item => item.id !== id);
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

function makeLayerPropsOptions(
  component: T.Component,
  layerId: string | undefined
): [string, string][] {
  if (layerId == null || component.layout == null) {
    return [];
  }

  const layer = findLayerById(component.layout, layerId);

  if (layer == null) {
    return [];
  }

  return getPropertiesNames(layer.type).map(prop => [prop, prop]);
}

function validateLayer(layerId: string | undefined) {
  if (layerId == null) {
    return "Layer is required";
  }
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

export default function ComponentOverrides({
  component,
  onOverridesChange
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const layerEntry = useSelectFormEntry(
    component.layout ? component.layout.id : undefined,
    str => validateLayer(str)
  );
  const layersOptions = layerTreeToArray(component.layout).map(layer => [
    layer.id,
    layer.name
  ]) as [string, string][];

  const layerPropEntry = useSelectFormEntry("text", str =>
    validateLayerProp(str)
  );
  const layersPropsOptions = makeLayerPropsOptions(component, layerEntry.value);

  const propIdEntry = useSelectFormEntry(undefined, propId =>
    validateComponentProp(component, layerPropEntry.value, propId)
  );
  const propsOptions = component.props.map(prop => [prop.id, prop.name]) as [
    string,
    string
  ][];

  const createOrUpdateDialog = useDialogForm(
    [layerEntry, layerPropEntry, propIdEntry],
    () => {
      if (selectedId == null) {
        onOverridesChange(
          add(component, propIdEntry.value!, layerEntry.value!)
        );
      } else {
        onOverridesChange(
          edit(component, selectedId, propIdEntry.value!, layerEntry.value!)
        );
      }
    }
  );
  return (
    <div css={[column]}>
      <div
        css={[
          row,
          { justifyContent: "space-between", margin: "24px 24px 16px 24px" }
        ]}
      >
        <h2 css={sectionTitle}>Overrides</h2>
        <AddButton
          disabled={component.props.length === 0}
          onClick={() => {
            setSelectedId(null);
            createOrUpdateDialog.open();
            propIdEntry.setValue(component.props[0].id);
          }}
        />
        <OkCancelModal
          title="Override a layer with a component property"
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
                <span css={labelsStyle}>Layer to override</span>
                <div css={row}>
                  <FormSelect
                    placeholder="Layer"
                    options={layersOptions}
                    {...layerEntry.inputProps}
                    onChange={e => {
                      layerEntry.inputProps.onChange(e);
                      const layer = findLayerById(
                        component.layout!,
                        e.target.value
                      )!;
                      layerPropEntry.setValue(
                        getPropertiesNames(layer.type)[0]
                      );
                    }}
                  />
                  <FormSelect
                    placeholder="Layer"
                    options={layersPropsOptions}
                    cssOverrides={{ marginLeft: "8px" }}
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
      </div>
      {component.overrides.map(override => {
        return (
          <div
            key={override.id}
            css={[
              row,
              {
                paddingLeft: "22px",
                paddingTop: "4px",
                paddingBottom: "4px",
                paddingRight: "8px",
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
                  marginLeft: "4px",
                  height: "28px",
                  alignItems: "center"
                }
              ]}
            >
              <span>
                {getComponentPropName(component, override.propId)}.
                {override.layerProp}
              </span>
              <span css={{ margin: "6px 8px 0 8px" }}>
                <Link height={20} width={20} />
              </span>
              <span>
                {findLayerById(component.layout!, override.layerId)!.name}
              </span>
            </div>
            <IconButton
              cssOverrides={{ display: "none", flex: "0 0 auto" }}
              icon={<Edit height={20} width={20} />}
              onClick={e => {
                e.stopPropagation();
                setSelectedId(override.id);
                createOrUpdateDialog.open();
                propIdEntry.setValue(override.propId);
                layerEntry.setValue(override.layerId);
              }}
            />
            <IconButton
              cssOverrides={{ display: "none", flex: "0 0 auto" }}
              icon={<Delete height={20} width={20} />}
              onClick={e => {
                e.stopPropagation();
                onOverridesChange(remove(component, override.id));
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
