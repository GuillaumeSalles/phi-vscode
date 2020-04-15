/** @jsx jsx */
import { jsx } from "@emotion/core";
import * as T from "../../types";
import { row, colors } from "../../styles";
import { useToggle, useWarningDialog } from "../../hooks";
import { useRef } from "react";
import Popover from "../../components/Popover";
import IconButton from "../../components/IconButton";
import { ChevronDown, Edit, Delete } from "../../icons";
import {
  useStringFormEntry,
  useDialogForm,
  FormInput,
} from "../../components/Form";
import { validateRefName } from "../../validators";
import {
  filterComponentsWhenLayer,
  uiStateComponentOrThrow,
} from "../../refsUtil";
import OkCancelModal from "../../components/OkCancelModal";
import Button from "../../components/Button";
import React from "react";
import SecondaryButton from "../../components/SecondaryButton";

type Props = {
  applyAction: T.ApplyAction;
  refs: T.Refs;
  component: T.Component;
};

export default function TitleMenu({ applyAction, component, refs }: Props) {
  const uiState = uiStateComponentOrThrow(refs);

  const titleMenu = useToggle(false);
  const titleMenuRef = useRef<HTMLDivElement>(null);

  const nameEntry = useStringFormEntry("", (value) =>
    validateRefName(value, uiState.componentId, refs.components, "Components")
  );
  const renameComponentDialog = useDialogForm([nameEntry], () => {
    applyAction({
      type: "renameComponent",
      componentId: uiState.componentId,
      name: nameEntry.value,
    });
  });

  const componentsThatUseCurrentComponent = filterComponentsWhenLayer(
    refs,
    (l) => l.type === "component" && l.componentId === uiState.componentId
  );
  const deleteRefDialog = useWarningDialog(
    `Can't delete component ${component.name}`,
    `${component.name} is used by ${componentsThatUseCurrentComponent
      .map((c) => `"${c.name}"`)
      .join(", ")}.`
  );

  return (
    <div ref={titleMenuRef}>
      <Popover
        isOpen={titleMenu.isActive}
        onDismiss={titleMenu.deactivate}
        anchor={titleMenuRef}
        position="bottom"
      >
        <div
          css={[
            {
              boxShadow: "rgba(0, 0, 0, 0.12) 0px 5px 10px 0px",
              background: colors.popupBackground,
              margin: "8px 0",
              width: "120px",
            },
          ]}
        >
          <Item
            name="Rename"
            onClick={() => {
              renameComponentDialog.open();
              nameEntry.setValue(component.name);
            }}
            icon={<Edit height={16} width={16} />}
          />
          <Item
            name="Delete"
            onClick={() => {
              if (componentsThatUseCurrentComponent.length === 0) {
                applyAction({
                  type: "deleteComponent",
                  componentId: uiState.componentId,
                });
              } else {
                deleteRefDialog.open();
              }
            }}
            icon={<Delete height={16} width={16} />}
          />
        </div>
      </Popover>
      <IconButton
        cssOverrides={{ margin: "6px 0 0 4px" }}
        icon={<ChevronDown height={12} width={12} />}
        onClick={titleMenu.activate}
      />
      <OkCancelModal
        {...deleteRefDialog.dialogProps}
        buttons={<Button text="Ok" {...deleteRefDialog.okProps} />}
      />
      <OkCancelModal
        title="Rename component"
        {...renameComponentDialog.dialogProps}
        buttons={
          <React.Fragment>
            <SecondaryButton
              text="Cancel"
              {...renameComponentDialog.cancelButtonProps}
            />
            <Button text="Add" {...renameComponentDialog.okButtonProps} />
          </React.Fragment>
        }
        form={
          <React.Fragment>
            <FormInput
              placeholder="Name your component"
              {...nameEntry.inputProps}
            />
          </React.Fragment>
        }
      />
    </div>
  );
}

function Item({
  onClick,
  name,
  icon,
}: {
  onClick: () => void;
  name: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      key={name}
      onClick={onClick}
      css={[
        row,
        {
          alignItems: "center",
          padding: "8px 12px",
          border: "none",
          width: "100%",
          fontSize: "12px",
          background: "transparent",
          color: colors.sideBarForeground,
          ":hover": {
            backgroundColor: colors.listHoverBackground,
          },
        },
      ]}
    >
      {icon}
      <span css={{ marginLeft: "4px" }}>{name}</span>
    </button>
  );
}
