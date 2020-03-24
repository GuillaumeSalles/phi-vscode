/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { column, row, sectionTitle } from "../../../styles";
import Field from "../../../components/Field";
import TextInput from "../../../components/TextInput";
import Section from "./Section";
import AddButton from "../../../components/AddButton";
import {
  useStringFormEntry,
  useDialogForm,
  FormInput
} from "../../../components/Form";
import OkCancelModal from "../../../components/OkCancelModal";
import React from "react";
import SecondaryButton from "../../../components/SecondaryButton";
import Button from "../../../components/Button";
import IconButton from "../../../components/IconButton";
import { Delete } from "../../../icons";

type Props = {
  component: T.Component;
  componentId: string;
  applyAction: T.ApplyAction;
};

export default function ComponentExamplesEditor({
  component,
  componentId,
  applyAction
}: Props) {
  const nameEntry = useStringFormEntry("", value => undefined);
  const createDialog = useDialogForm([nameEntry], () => {
    applyAction({
      type: "addComponentExample",
      name: nameEntry.value,
      componentId
    });
  });

  return (
    <div css={[column, { overflowY: "auto" }]}>
      <div
        css={[
          row,
          { margin: "24px 24px 16px 24px", justifyContent: "space-between" }
        ]}
      >
        <span css={[sectionTitle]}>Examples</span>
        <AddButton onClick={createDialog.open} />
      </div>
      {component.examples.map(example => {
        return (
          <Section
            key={example.id}
            title={example.name}
            topRightButton={
              <IconButton
                icon={<Delete height={18} width={18} />}
                onClick={() => {
                  applyAction({
                    type: "deleteComponentExample",
                    id: example.id,
                    componentId
                  });
                }}
              />
            }
          >
            {component.props.map(prop => {
              return (
                <Field key={prop.name} label={prop.name}>
                  <TextInput
                    cssOverrides={{ width: "100%" }}
                    value={
                      example.props[prop.name] != null
                        ? example.props[prop.name]
                        : ""
                    }
                    onChange={value => {
                      applyAction({
                        type: "updateComponentExampleProp",
                        componentId,
                        exampleId: example.id,
                        prop: prop.name,
                        value: value != null ? value : ""
                      });
                    }}
                  />
                </Field>
              );
            })}
          </Section>
        );
      })}
      <OkCancelModal
        title="Create new example"
        {...createDialog.dialogProps}
        buttons={
          <React.Fragment>
            <SecondaryButton
              text="Cancel"
              {...createDialog.cancelButtonProps}
            />
            <Button text="Add" {...createDialog.okButtonProps} />
          </React.Fragment>
        }
        form={
          <React.Fragment>
            <FormInput
              placeholder="Name your example"
              {...nameEntry.inputProps}
            />
          </React.Fragment>
        }
      />
    </div>
  );
}
