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
  useStringFormEntry,
  FormInput
} from "../../components/Form";
import { Delete, Edit } from "../../icons";
import React, { useState } from "react";
import uuid from "uuid/v4";
import { validateRefName } from "../../validators";

type Props = {
  component: T.Component;
  onComponentChange: (newComponent: T.Component) => void;
};

function makeComponentProp(
  id: string,
  name: string,
  type: string
): T.ComponentProp {
  return {
    id,
    name,
    type: type as T.ComponentPropType
  };
}

function addProp(
  component: T.Component,
  name: string,
  type: string
): T.ComponentProp[] {
  return [...component.props, makeComponentProp(uuid(), name, type)];
}

function editProp(
  component: T.Component,
  id: string,
  name: string,
  type: string
): T.ComponentProp[] {
  return component.props.map(prop =>
    prop.id === id ? makeComponentProp(id, name, type) : prop
  );
}

function deleteProp(component: T.Component, id: string): T.ComponentProp[] {
  return component.props.filter(prop => prop.id !== id);
}

export default function ComponentProps({
  component,
  onComponentChange
}: Props) {
  function onPropsChange(props: T.ComponentProp[]) {
    onComponentChange({ ...component, props });
  }

  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);
  const nameEntry = useStringFormEntry("", str =>
    validateRefName(
      str,
      selectedPropId,
      new Map(component.props.map(prop => [prop.id, prop])),
      "Property"
    )
  );
  const createOrUpdateDialog = useDialogForm([nameEntry], () => {
    if (selectedPropId == null) {
      onPropsChange(addProp(component, nameEntry.value, "text"));
    } else {
      onPropsChange(
        editProp(component, selectedPropId, nameEntry.value, "text")
      );
    }
  });
  return (
    <div css={[column]}>
      <div
        css={[
          row,
          { justifyContent: "space-between", margin: "24px 24px 16px 24px" }
        ]}
      >
        <h2 css={sectionTitle}>Properties</h2>
        <AddButton
          disabled={false}
          onClick={() => {
            setSelectedPropId(null);
            createOrUpdateDialog.open();
          }}
        />
        <OkCancelModal
          title="Create property"
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
              <FormInput
                placeholder="Name your component property"
                {...nameEntry.inputProps}
              />
            </>
          }
        />
      </div>
      {component.props.map(prop => {
        return (
          <div
            key={prop.id}
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
              css={{
                flex: "1 1 auto",
                marginLeft: "4px",
                height: "28px",
                lineHeight: "28px"
              }}
            >
              {prop.name}
            </div>
            <IconButton
              cssOverrides={{ display: "none", flex: "0 0 auto" }}
              icon={<Edit height={20} width={20} />}
              onClick={e => {
                e.stopPropagation();
                setSelectedPropId(prop.id);
                createOrUpdateDialog.open();
                nameEntry.setValue(prop.name);
              }}
            />
            <IconButton
              cssOverrides={{ display: "none", flex: "0 0 auto" }}
              icon={<Delete height={20} width={20} />}
              onClick={e => {
                e.stopPropagation();
                onComponentChange({
                  ...component,
                  props: deleteProp(component, prop.id)
                });
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
