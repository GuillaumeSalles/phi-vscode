/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../../types";
import { row, column } from "../../../styles";
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
import { Delete, Edit } from "../../../icons";
import React, { useState } from "react";
import uuid from "uuid/v4";
import Section from "./Section";
import StyleOverrideEditor from "./StyleOverrideEditor";
import Field from "../../../components/Field";

type Props = {
  style: T.LayerStyle;
  onChange: (style: T.LayerStyle) => void;
  refs: T.Refs;
};

function makeOverride(
  id: string,
  pseudoClass: string,
  style: T.LayerStyle
): T.StyleOverride {
  return {
    id,
    pseudoClass,
    style
  };
}

function add(rootStyle: T.LayerStyle, pseudoClass: string): T.StyleOverride[] {
  return [
    ...(rootStyle.overrides || []),
    makeOverride(uuid(), pseudoClass, {})
  ];
}

function edit(
  rootStyle: T.LayerStyle,
  id: string,
  pseudoClass: string,
  style: T.LayerStyle
): T.StyleOverride[] {
  return rootStyle.overrides!.map(override =>
    override.id === id ? makeOverride(id, pseudoClass, style) : override
  );
}

function updateOverrideStyle(
  rootStyle: T.LayerStyle,
  id: string,
  style: T.LayerStyle
): T.StyleOverride[] {
  return rootStyle.overrides!.map(override =>
    override.id === id
      ? makeOverride(id, override.pseudoClass, style)
      : override
  );
}

function remove(rootStyle: T.LayerStyle, id: string): T.StyleOverride[] {
  return rootStyle.overrides!.filter(item => item.id !== id);
}

export default function StyleOverridesEditor({ style, onChange, refs }: Props) {
  function updateOverrides(overrides: T.StyleOverride[]) {
    onChange({ ...style, overrides });
  }

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const pseudoClassEntry = useSelectFormEntry(
    ":hover",
    pseudoClass => undefined
  );
  const pseudoClassesOptions = [[":hover", ":hover"]] as [string, string][];

  const createOrUpdateDialog = useDialogForm([pseudoClassEntry], () => {
    if (selectedId == null) {
      updateOverrides(add(style, pseudoClassEntry.value!));
    } else {
      updateOverrides(
        edit(style, selectedId, pseudoClassEntry.value!, { overrides: [] })
      );
    }
  });
  return (
    <Section
      title="Overrides"
      topRightButton={
        <AddButton
          disabled={false}
          onClick={() => {
            setSelectedId(null);
            createOrUpdateDialog.open();
            pseudoClassEntry.setValue(":hover");
          }}
        />
      }
    >
      <OkCancelModal
        title="Define the necessary condition to apply the custom style"
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
          <FormSelect
            placeholder="Layer"
            options={pseudoClassesOptions}
            {...pseudoClassEntry.inputProps}
          />
        }
      />
      {(style.overrides == null || style.overrides.length === 0) && (
        <span css={{ fontSize: "12px", color: "#999", padding: "8px" }}>
          Override the layer style based on interaction
        </span>
      )}
      {style.overrides != null &&
        style.overrides.map(override => {
          return (
            <div
              key={override.id}
              css={[
                column,
                {
                  margin: "4px 8px",
                  background: "white"
                }
              ]}
            >
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
                  <Field label="Pseudo class">
                    <span>{override.pseudoClass}</span>
                  </Field>
                </div>
                <IconButton
                  cssOverrides={{ display: "none", flex: "0 0 auto" }}
                  icon={<Edit height={20} width={20} />}
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedId(override.id);
                    createOrUpdateDialog.open();
                    pseudoClassEntry.setValue(override.pseudoClass);
                  }}
                />
                <IconButton
                  cssOverrides={{ display: "none", flex: "0 0 auto" }}
                  icon={<Delete height={20} width={20} />}
                  onClick={e => {
                    e.stopPropagation();
                    updateOverrides(remove(style, override.id));
                  }}
                />
              </div>
              <StyleOverrideEditor
                refs={refs}
                rootStyle={style}
                style={override.style}
                onChange={newStyle => {
                  updateOverrides(
                    updateOverrideStyle(style, override.id, newStyle)
                  );
                }}
              />
            </div>
          );
        })}
    </Section>
  );
}
