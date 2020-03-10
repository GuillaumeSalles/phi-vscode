/** @jsx jsx */
import { jsx } from "@emotion/core";
import { column, row, sectionTitle } from "../styles";
import * as T from "../types";
import AddButton from "./AddButton";
import OkCancelModal from "./OkCancelModal";
import React from "react";
import { useStringFormEntry, FormInput, useDialogForm } from "./Form";
import { validateComponentName } from "../validators";
import SecondaryButton from "./SecondaryButton";
import Button from "./Button";
import uuid from "uuid";

type Props = {
  components: T.ComponentMap;
  applyAction: (action: T.Action) => void;
  uiState: T.UIState;
};

function MenuItem({
  onClick,
  text,
  isSelected
}: {
  onClick: () => void;
  text: string;
  isSelected: boolean;
}) {
  return (
    <div
      css={{
        padding: "8px 8px 8px 24px",
        paddingLeft: isSelected ? "20px" : "24px",
        borderLeft: isSelected ? "4px solid black" : "none"
      }}
    >
      <button
        onClick={onClick}
        css={{
          fontSize: "14px",
          color: "rgb(0, 0, 0)",
          boxSizing: "border-box",
          textDecoration: "none",
          fontWeight: isSelected ? 600 : 400,
          cursor: "pointer",
          background: "none",
          outline: "none",
          border: "none",
          margin: "0",
          padding: "0"
        }}
      >
        {text}
      </button>
    </div>
  );
}

function Menu({ components, applyAction, uiState }: Props) {
  const nameEntry = useStringFormEntry("", value =>
    validateComponentName(value, null, components)
  );
  const createComponentDialog = useDialogForm([nameEntry], () => {
    applyAction({
      type: "addComponent",
      name: nameEntry.value,
      componentId: uuid()
    });
  });
  return (
    <div
      css={[
        column,
        {
          paddingTop: "24px",
          width: "240px",
          height: "100%",
          justifyContent: "space-between"
        }
      ]}
    >
      <div
        css={[
          column,
          {
            paddingBottom: "24px",
            width: "240px"
          }
        ]}
      >
        <span
          css={[
            sectionTitle,
            {
              paddingLeft: "24px",
              paddingBottom: "16px"
            }
          ]}
        >
          Styles
        </span>
        <MenuItem
          onClick={() =>
            applyAction({ type: "goTo", to: { type: "typography" } })
          }
          text="Typography"
          isSelected={uiState.type === "typography"}
        />
        <MenuItem
          onClick={() => applyAction({ type: "goTo", to: { type: "colors" } })}
          text="Colors"
          isSelected={uiState.type === "colors"}
        />
        <MenuItem
          onClick={() =>
            applyAction({ type: "goTo", to: { type: "breakpoints" } })
          }
          text="Breakpoints"
          isSelected={uiState.type === "breakpoints"}
        />
        <div
          css={[
            row,
            { margin: "40px 24px 16px 24px", justifyContent: "space-between" }
          ]}
        >
          <span css={[sectionTitle]}>Components</span>
          <AddButton onClick={createComponentDialog.open} />
        </div>
        {Array.from(components.entries()).map(entry => (
          <MenuItem
            key={entry[0]}
            onClick={() =>
              applyAction({
                type: "goTo",
                to: { type: "component", componentId: entry[0] }
              })
            }
            text={entry[1].name}
            isSelected={
              uiState.type === "component" && uiState.componentId === entry[0]
            }
          />
        ))}
      </div>
      <OkCancelModal
        title="Create new component"
        {...createComponentDialog.dialogProps}
        buttons={
          <React.Fragment>
            <SecondaryButton
              text="Cancel"
              {...createComponentDialog.cancelButtonProps}
            />
            <Button text="Add" {...createComponentDialog.okButtonProps} />
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

export default Menu;
